import { Event } from '@/src/types/event';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service workers not supported');
}

export async function scheduleNotification(event: Event) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    throw new Error('Notifications not permitted');
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const reminderTime = new Date(
      event.date.toDate().getTime() - (event.memoPreferences.sendTime * 60 * 60 * 1000)
    );

    await registration.showNotification(`Upcoming Event: ${event.title}`, {
      body: `Your event is coming up on ${event.date.toDate().toLocaleString()}`,
      icon: '/icon.png',
      badge: '/badge.png',
      tag: event.id, // Ensure only one notification per event
      data: {
        url: `/events/${event.id}`,
        eventId: event.id,
      },
    });

    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
} 