import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

interface User {
  id: number;
  role: string;
}

interface AuthContextType {
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  session: {
    token: string;
    user: User;
  } | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (__DEV__) {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

// Rename SessionProvider to AuthProvider
export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const handleSignIn = (token: string, user: User) => {
    setSession(JSON.stringify({ token, user }));
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: () => setSession(null),
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Make sure to export everything properly
export { AuthContext, useSession as useAuth };
