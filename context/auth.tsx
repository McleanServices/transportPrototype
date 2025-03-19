import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { generateSessionKey, isSessionKeyExpired } from '../utils/sessionUtils'; // Import generateSessionKey and isSessionKeyExpired

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
    sessionKey: string; // Added sessionKey
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
  const [storedSessionKey, setStoredSessionKey] = useStorageState('sessionKey'); // Add useStorageState for sessionKey

  useEffect(() => {
    if (storedSessionKey[1]) {
      const expired = isSessionKeyExpired(storedSessionKey[1]);
      console.log('Stored session key:', storedSessionKey[1]); // Log the stored session key
      console.log('Is stored session key expired:', expired); // Log if the stored session key is expired
      if (expired) {
        setSession(null);
        setStoredSessionKey(null);
      }
    }
  }, [storedSessionKey]);

  const handleSignIn = async (token: string, user: User) => {
    const sessionKey = await generateSessionKey(); // Generate a session key
    setStoredSessionKey(sessionKey); // Save session key
    setSession(JSON.stringify({ token, user, sessionKey }));
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: () => {
          setSession(null);
          setStoredSessionKey(null); // Clear session key
        },
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Make sure to export everything properly
export { AuthContext, useSession as useAuth };
