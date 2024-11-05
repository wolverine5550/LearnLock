import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { scheduleReminder } from '@/src/lib/reminders';
import { 
  requestNotificationPermission, 
  registerServiceWorker,
  scheduleNotification 
} from '@/src/lib/notifications';
import type { Event } from '@/src/types/event';
import { getUserPreferences } from '@/src/lib/userPreferences';
import { NotificationPreferences } from '@/src/types/user';

export function useReminders() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userPreferences, setUserPreferences] = useState<NotificationPreferences | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const permitted = await requestNotificationPermission();
        if (permitted) {
          await registerServiceWorker();
          setNotificationsEnabled(true);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        const prefs = await getUserPreferences(user.uid);
        setUserPreferences(prefs);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, [user]);

  const scheduleEventReminder = async (event: Event) => {
    if (!user?.email || !userPreferences) return;

    try {
      setIsScheduling(true);
      
      // Schedule email reminder if enabled
      if (userPreferences.emailEnabled) {
        await scheduleReminder(event, user.email);
      }
      
      // Schedule push notification if enabled
      if (userPreferences.pushEnabled && notificationsEnabled) {
        await scheduleNotification(event);
      }
      
      toast({
        title: "Reminder scheduled",
        description: `You'll receive a reminder ${event.memoPreferences.sendTime} hours before the event`,
      });
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule reminder",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    isScheduling,
    scheduleEventReminder,
    notificationsEnabled,
    userPreferences,
  };
} 