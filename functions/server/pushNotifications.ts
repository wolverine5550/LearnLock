import * as admin from 'firebase-admin';
import type { Event } from './types';

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

export async function sendPushNotification(event: Event, userId: string) {
  if (!vapidPrivateKey) {
    console.error('VAPID private key not found');
    return;
  }

  try {
    // Get user's push subscription
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const pushSubscription = userDoc.data()?.pushSubscription;
    if (!pushSubscription) return;

    const message = {
      notification: {
        title: `Upcoming Event: ${event.title}`,
        body: `Your event is coming up on ${event.date.toDate().toLocaleString()}`,
      },
      data: {
        url: `/events/${event.id}`,
        eventId: event.id,
        type: 'event_reminder',
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          icon: '/icon.png',
          badge: '/badge.png',
          actions: [
            {
              action: 'open',
              title: 'View Event',
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
            },
          ],
        },
        fcmOptions: {
          link: `/events/${event.id}`,
        },
      },
      token: pushSubscription.token,
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
} 