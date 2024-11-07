import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import type { ScheduledEvent } from 'firebase-functions/v2/scheduler';
import type { Event, UserPreferences } from './types';
import { getEventReminderTemplate, getMemoReadyTemplate } from './emailTemplates';
import { sendPushNotification } from './pushNotifications';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Resend with Firebase config
const resend = new Resend(process.env.RESEND_API_KEY);

export const checkUpcomingEvents = onSchedule('0 * * * *', async (event: ScheduledEvent) => {
  const now = admin.firestore.Timestamp.now();
  const db = admin.firestore();

  try {
    // Get all upcoming events
    const eventsSnapshot = await db
      .collection('events')
      .where('date', '>', now)
      .get();

    for (const doc of eventsSnapshot.docs) {
      const event = doc.data() as Event;
      const timeUntilEvent = event.date.toMillis() - now.toMillis();
      const notificationTime = event.memoPreferences.sendTime * 60 * 60 * 1000; // Convert hours to ms

      // Check if it's time to send notification
      if (timeUntilEvent <= notificationTime && timeUntilEvent > notificationTime - 3600000) { // Within the last hour window
        // Get user preferences
        const userDoc = await db.collection('users').doc(event.userId).get();
        const userPrefs = userDoc.data()?.notificationPreferences as UserPreferences;

        if (userPrefs?.emailEnabled) {
          await sendEmailNotification(event, userDoc.data()?.email);
        }

        if (userPrefs?.pushEnabled) {
          await sendPushNotification(event, event.userId);
        }

        // Mark notification as sent
        await doc.ref.update({
          notificationSent: true,
          notificationSentAt: now,
        });
      }
    }
  } catch (error) {
    console.error('Error checking upcoming events:', error);
  }
});

async function sendEmailNotification(event: Event, userEmail?: string, memoContent?: string) {
  if (!userEmail) return;

  try {
    const template = memoContent 
      ? getMemoReadyTemplate(event, memoContent)
      : getEventReminderTemplate(event);

    const subject = memoContent
      ? `Your Memo is Ready: ${event.title}`
      : `Upcoming Event: ${event.title}`;

    await resend.emails.send({
      from: 'LearnLock <notifications@learnlock.app>',
      to: userEmail,
      subject: subject,
      html: template,
      tags: [
        { name: 'eventId', value: event.id },
        { name: 'type', value: memoContent ? 'memo' : 'reminder' }
      ]
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
} 