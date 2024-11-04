import { useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useSessionManager() {
  const { toast } = useToast();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastActivity = Date.now();

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      lastActivity = Date.now();
      
      timeoutId = setTimeout(async () => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT && auth.currentUser) {
          try {
            await auth.signOut();
            toast({
              title: "Session expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
          } catch (error) {
            console.error("Error signing out:", error);
          }
        }
      }, SESSION_TIMEOUT);
    };

    // Activity events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [toast]);
} 