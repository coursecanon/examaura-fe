import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import api from '../api/axiosConfig';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginWithToken: (
    token: string,
    refreshToken: string, // 🚀 Fixed type definition to require the refresh token
    userData?: LoginResponse
  ) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );

    const jsonPayload = decodeURIComponent(
      window
        .atob(paddedBase64)
        .split('')
        .map(
          (c) =>
            '%' +
            ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // 🚀 Updated to clear both tracking tokens on sign-out
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  /**
   * App startup / page refresh
   */
  useEffect(() => {
    const initializeUser = async () => {
      console.log('App startup...'); // Debug log to track initialization
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        console.log('enterred try'); // Debug log before decoding
        const payload = decodeToken(token);

        // 🚀 Make sure the payload is entirely valid before fetching
        if (!payload || !payload.userId) {
          console.warn("Invalid token payload or missing userId. Logging out.");
          logout();
          return;
        }

        // Note: If this token is expired, your new Axios interceptor 
        // will automatically catch it here and run the refresh cycle seamlessly!
        const response = await api.get(`/users/${payload.userId}`);

        const userData = response.data;
        console.log("Fetched user data on app init:", userData); // Debug log to verify fetched user data

        setUser({
          id: userData.id,
          name: userData.fullName,
          email: userData.email,
          role: userData.userRole,
          avatar: userData.avatarUrl || DEFAULT_AVATAR,
        });
      } catch (error) {
        console.log("error in catch"); // Debug log to track error handling
        console.error(
          'Failed to restore user session:',
          error
        );
        logout();
      }
    };

    initializeUser();
  }, [logout]);

  /**
   * Called after successful login/register or OAuth2 Redirect
   */
  const loginWithToken = useCallback(
    (token: string, refreshToken: string, userData?: LoginResponse) => {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      console.log("login/register", userData); // Debug log to verify user data on login/register
      if (userData) {
        setUser({
          id: userData.userId,
          name: userData.fullName,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatarUrl || DEFAULT_AVATAR,
        });
         // Debug log to verify user state after login/register
      } else {
        // 🚀 FALLBACK FOR OAUTH2 redirects:
        // Decode the incoming JWT to instantly set up state context so 
        // the app logs them in immediately without waiting for a refresh.
        const payload = decodeToken(token);
        console.log("Decoded token payload on login:", payload); // Debug log to verify payload structure
        if (payload) {
          setUser({
            id: payload.userId || '',
            name: payload.fullName || payload.name || payload.sub || 'OAuth User',
            email: payload.sub || '',
            role: payload.role || 'VIEWER',
            avatar: payload.avatarUrl || DEFAULT_AVATAR,
          });
        }
      }
    },
    []
  );

  console.log("Current user state:", user); // Debug log to track user state changes

  const contextValue = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      loginWithToken,
      logout,
    }),
    [user, loginWithToken, logout]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser must be used within a UserProvider'
    );
  }

  return context;
}