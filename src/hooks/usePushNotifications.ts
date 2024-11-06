import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if push notifications are supported
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const existingSubscription = await registration.pushManager.getSubscription();
          setSubscription(existingSubscription);
        } catch (error) {
          console.error('Error checking push subscription:', error);
        }
      }
    };

    checkSupport();
  }, []);

  const registerForPushNotifications = async () => {
    if (!user || !isSupported) return;

    try {
      setIsRegistering(true);

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await registration.update();

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Save subscription to user document
      await updateDoc(doc(db, 'users', user.uid), {
        pushSubscription: subscription.toJSON(),
        updatedAt: new Date(),
      });

      setSubscription(subscription);
      
      toast({
        title: "Push notifications enabled",
        description: "You'll now receive notifications for upcoming events",
      });
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      toast({
        variant: "destructive",
        title: "Error enabling notifications",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const unregisterFromPushNotifications = async () => {
    if (!user || !subscription) return;

    try {
      setIsRegistering(true);

      // Unsubscribe from push notifications
      await subscription.unsubscribe();

      // Remove subscription from user document
      await updateDoc(doc(db, 'users', user.uid), {
        pushSubscription: null,
        updatedAt: new Date(),
      });

      setSubscription(null);
      
      toast({
        title: "Push notifications disabled",
        description: "You won't receive notifications anymore",
      });
    } catch (error) {
      console.error('Error unregistering from push notifications:', error);
      toast({
        variant: "destructive",
        title: "Error disabling notifications",
        description: "Please try again later",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isSupported,
    isRegistered: !!subscription,
    isRegistering,
    registerForPushNotifications,
    unregisterFromPushNotifications,
  };
} 