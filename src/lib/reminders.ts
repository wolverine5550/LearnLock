import { Event } from '@/src/types/event';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function scheduleReminder(event: Event, userEmail: string) {
  try {
    // Calculate when to send the reminder based on event preferences
    const reminderTime = new Date(
      event.date.toDate().getTime() - (event.memoPreferences.sendTime * 60 * 60 * 1000)
    );

    // Schedule the email to be sent at the reminder time
    await resend.emails.send({
      from: 'LearnLock <notifications@learnlock.app>',
      to: userEmail,
      subject: `Reminder: ${event.title}`,
      html: `
        <h2>Upcoming Event: ${event.title}</h2>
        <p>Your event is coming up on ${event.date.toDate().toLocaleString()}</p>
        <h3>Event Goals:</h3>
        <p>${event.context.goals}</p>
        ${event.context.location ? `<p>Location: ${event.context.location}</p>` : ''}
        <hr />
        <p>Your memo will be generated and sent before the event.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw error;
  }
} 