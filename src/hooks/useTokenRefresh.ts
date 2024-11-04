import { useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Token will be refreshed 5 minutes before expiry
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useTokenRefresh() {
  const { toast } = useToast();

  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout;

    const setupRefreshTimeout = async () => {
      try {
        const token = await auth.currentUser?.getIdTokenResult();
        if (!token) return;

        // Calculate when the token will expire
        const expirationTime = new Date(token.expirationTime).getTime();
        const timeUntilRefresh = expirationTime - Date.now() - REFRESH_THRESHOLD;

        // Clear any existing timeout
        if (refreshTimeout) clearTimeout(refreshTimeout);

        // Set up the refresh timeout
        refreshTimeout = setTimeout(async () => {
          try {
            await auth.currentUser?.getIdToken(true); // Force token refresh
          } catch (error) {
            console.error('Token refresh error:', error);
            toast({
              title: 'Session refresh failed',
              description: 'Please sign in again to continue.',
              variant: 'destructive',
            });
          }
        }, timeUntilRefresh);
      } catch (error) {
        console.error('Token setup error:', error);
      }
    };

    // Set up listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setupRefreshTimeout();
      } else if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      if (refreshTimeout) clearTimeout(refreshTimeout);
    };
  }, [toast]);
} 