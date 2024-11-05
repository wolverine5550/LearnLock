import { useState, useEffect } from 'react';
import { getUserEvents } from '@/src/lib/events';
import type { Event } from '@/src/types/event';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedEvents = await getUserEvents(user.uid);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "Error loading events",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    loading,
    refetch: fetchEvents,
  };
} 