import { browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';

export type PersistenceLevel = 'local' | 'session' | 'none';

export class AuthPersistenceManager {
  private static PERSISTENCE_KEY = 'auth_persistence_level';

  static async setPersistenceLevel(level: PersistenceLevel) {
    try {
      if (typeof window === 'undefined') return; // Check for browser environment

      switch (level) {
        case 'local':
          await setPersistence(auth, browserLocalPersistence);
          localStorage.setItem(this.PERSISTENCE_KEY, level);
          break;
        case 'session':
          await setPersistence(auth, browserSessionPersistence);
          sessionStorage.setItem(this.PERSISTENCE_KEY, level);
          localStorage.removeItem(this.PERSISTENCE_KEY);
          break;
        case 'none':
          // Clear all stored persistence
          localStorage.removeItem(this.PERSISTENCE_KEY);
          sessionStorage.removeItem(this.PERSISTENCE_KEY);
          break;
      }
    } catch (error) {
      console.error('Error setting persistence:', error);
      throw error;
    }
  }

  static getPersistenceLevel(): PersistenceLevel {
    if (typeof window === 'undefined') return 'none'; // Check for browser environment

    const localLevel = localStorage.getItem(this.PERSISTENCE_KEY) as PersistenceLevel;
    const sessionLevel = sessionStorage.getItem(this.PERSISTENCE_KEY) as PersistenceLevel;
    
    return localLevel || sessionLevel || 'none';
  }

  static clearPersistedAuth() {
    if (typeof window === 'undefined') return; // Check for browser environment

    localStorage.removeItem(this.PERSISTENCE_KEY);
    sessionStorage.removeItem(this.PERSISTENCE_KEY);
  }
} 