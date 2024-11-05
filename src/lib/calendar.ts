import { google } from 'googleapis';
import { Event } from '@/src/types/event';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// Initialize the Google Calendar API client
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function syncWithGoogleCalendar(event: Event): Promise<string> {
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: `Goals: ${event.context.goals}\n\nReferenced Books: ${event.bookIds.length}`,
        start: {
          dateTime: event.date.toDate().toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(event.date.toDate().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        location: event.context.location,
        attendees: event.context.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: event.memoPreferences.sendTime * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      },
    });

    return response.data.id || '';
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    throw error;
  }
}

export async function removeFromGoogleCalendar(eventId: string): Promise<void> {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  } catch (error) {
    console.error('Error removing from Google Calendar:', error);
    throw error;
  }
}

export async function getCalendarAuthUrl(): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
} 