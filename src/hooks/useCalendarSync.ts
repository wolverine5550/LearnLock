import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { syncWithGoogleCalendar, removeFromGoogleCalendar } from '@/src/lib/calendar';
import type { Event } from '@/src/types/event';

export function useCalendarSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncEvent = async (event: Event) => {
    try {
      setIsSyncing(true);
      await syncWithGoogleCalendar(event);
      toast({
        title: "Event synced",
        description: "Event has been added to your Google Calendar",
      });
    } catch (error) {
      console.error('Error syncing event:', error);
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "Could not sync with Google Calendar",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const removeEvent = async (eventId: string) => {
    try {
      setIsSyncing(true);
      await removeFromGoogleCalendar(eventId);
      toast({
        title: "Event removed",
        description: "Event has been removed from your Google Calendar",
      });
    } catch (error) {
      console.error('Error removing event:', error);
      toast({
        variant: "destructive",
        title: "Removal failed",
        description: "Could not remove from Google Calendar",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncEvent,
    removeEvent,
  };
} 