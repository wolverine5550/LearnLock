import { useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useSessionRecovery() {
  const { toast } = useToast();

  useEffect(() => {
    let recoveryAttempted = false;

    const attemptRecovery = async () => {
      if (recoveryAttempted) return;
      recoveryAttempted = true;

      try {
        // Try to get the current user
        const user = auth.currentUser;
        
        if (user) {
          // Verify the token is still valid
          await user.getIdToken(true);
        }
      } catch (error) {
        console.error('Session recovery error:', error);
        
        // Force sign out if recovery fails
        try {
          await auth.signOut();
          toast({
            title: "Session expired",
            description: "Please sign in again to continue",
            variant: "destructive",
          });
        } catch (signOutError) {
          console.error('Sign out error during recovery:', signOutError);
        }
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Attempt recovery when we detect a user session
        attemptRecovery();
      }
    });

    // Attempt immediate recovery
    attemptRecovery();

    return () => {
      unsubscribe();
    };
  }, [toast]);
} 