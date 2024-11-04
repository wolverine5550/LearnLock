'use client';

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from '@/src/hooks/useAuthState';
import { useSessionManager } from '@/src/hooks/useSessionManager';
import { useTokenRefresh } from '@/src/hooks/useTokenRefresh';
import { useSessionRecovery } from '@/src/hooks/useSessionRecovery';
import { useAuthPersistence } from '@/src/hooks/useAuthPersistence';
import { AuthErrorBoundary } from '@/src/components/auth/AuthErrorBoundary';
import type { PersistenceLevel } from '@/src/lib/authPersistence';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  persistenceLevel: PersistenceLevel;
  updatePersistence: (level: PersistenceLevel) => Promise<void>;
  clearPersistence: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  persistenceLevel: 'local',
  updatePersistence: async () => {},
  clearPersistence: () => {},
});

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useAuthState();
  const { persistenceLevel, updatePersistence, clearPersistence } = useAuthPersistence();
  useSessionManager();
  useTokenRefresh();
  useSessionRecovery();

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        persistenceLevel, 
        updatePersistence, 
        clearPersistence 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthErrorBoundary>
      <AuthProviderContent>{children}</AuthProviderContent>
    </AuthErrorBoundary>
  );
}

export const useAuth = () => useContext(AuthContext);