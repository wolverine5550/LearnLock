import type { Event } from './types';

export function getEventReminderTemplate(event: Event): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Event Reminder: ${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; }
          .button { 
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
            <p>Your event is coming up soon!</p>
          </div>
          <div class="content">
            <h2>${event.title}</h2>
            <p>Date: ${event.date.toDate().toLocaleString()}</p>
            <p>Your memo will be generated ${event.memoPreferences.sendTime} hours before the event.</p>
          </div>
          <div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}" class="button">
              View Event Details
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getMemoReadyTemplate(event: Event, memoContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Memo is Ready: ${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; }
          .memo { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Memo is Ready</h1>
            <p>We've prepared your memo for the upcoming event.</p>
          </div>
          <div class="content">
            <h2>${event.title}</h2>
            <p>Date: ${event.date.toDate().toLocaleString()}</p>
            <div class="memo">
              ${memoContent}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
} 