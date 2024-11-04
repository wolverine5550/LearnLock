import { useEffect, useState } from 'react';
import { AuthPersistenceManager, PersistenceLevel } from '@/src/lib/authPersistence';
import { useToast } from '@/hooks/use-toast';

export function useAuthPersistence() {
  const [persistenceLevel, setPersistenceLevel] = useState<PersistenceLevel>(
    AuthPersistenceManager.getPersistenceLevel()
  );
  const { toast } = useToast();

  const updatePersistence = async (level: PersistenceLevel) => {
    try {
      await AuthPersistenceManager.setPersistenceLevel(level);
      setPersistenceLevel(level);
      toast({
        title: 'Persistence Updated',
        description: `Auth persistence set to ${level}`,
      });
    } catch (error) {
      console.error('Error updating persistence:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update persistence settings',
      });
    }
  };

  useEffect(() => {
    // Initialize persistence on mount
    const currentLevel = AuthPersistenceManager.getPersistenceLevel();
    if (currentLevel !== persistenceLevel) {
      setPersistenceLevel(currentLevel);
    }
  }, [persistenceLevel]);

  return {
    persistenceLevel,
    updatePersistence,
    clearPersistence: () => {
      AuthPersistenceManager.clearPersistedAuth();
      setPersistenceLevel('none');
    },
  };
} 