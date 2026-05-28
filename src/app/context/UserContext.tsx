import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'; // 👈 Added useCallback and useMemo

export interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function decodeToken(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '='); // Ensures clean base64 string
    const jsonPayload = decodeURIComponent(
      window.atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    return {
      name: payload.fullName || payload.name || 'User',
      email: payload.sub || payload.email || '',
      avatar: payload.avatarUrl || payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop'
    };
  } catch (error) {
    console.error("Failed to decode auth token:", error);
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    return token ? decodeToken(token) : null;
  });

  // 1. 👈 STABILIZE loginWithToken reference with useCallback
  const loginWithToken = useCallback((token: string) => {
    localStorage.setItem('token', token);
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
  }, []); // Empty array means this function reference never changes

  // 2. 👈 STABILIZE logout reference with useCallback
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  // 3. 👈 Memoize the context object value itself to protect downstream children components
  const contextValue = useMemo(() => ({
    user,
    isLoggedIn: !!user,
    loginWithToken,
    logout
  }), [user, loginWithToken, logout]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}