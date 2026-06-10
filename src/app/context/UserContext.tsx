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

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  /**
   * App startup / page refresh
   */
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const payload = decodeToken(token);

        if (!payload?.userId) {
          logout();
          return;
        }

        const response = await api.get(
          `/users/${payload.userId}`
        );

        const userData = response.data;
        console.log('Restored user session:', userData);

        setUser({
          id: userData.id,
          name: userData.fullName,
          email: userData.email,
          role: userData.userRole,
          avatar: userData.avatarUrl || DEFAULT_AVATAR,
        });
      } catch (error) {
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
   * Called after successful login/register
   */
  const loginWithToken = useCallback(
    (token: string, userData?: LoginResponse) => {
      localStorage.setItem('token', token);

      if (userData) {
        setUser({
          id: userData.userId,
          name: userData.fullName,
          email: userData.email,
          role: userData.role,
          avatar:
            userData.avatarUrl || DEFAULT_AVATAR,
        });
      }
    },
    []
  );

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