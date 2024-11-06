import { aiService } from '@/src/lib/aiService';
import { createMemo, updateMemo } from '@/src/lib/memos';
import type { Event } from '@/src/types/event';
import type { Book } from '@/src/types/book';
import type { MemoFormat } from '@/src/types/memo';

export async function generateMemoForEvent(
  event: Event,
  books: Book[],
  format: MemoFormat,
  userId: string
): Promise<string> {
  let memoId: string | undefined;

  try {
    // Create initial memo record
    memoId = await createMemo(userId, {
      eventId: event.id,
      userId,
      bookIds: event.bookIds,
      format,
      viewed: false,
      shared: false,
      status: 'pending',
    });

    // Prepare event context
    const eventContext = `
      Event: ${event.title}
      Type: ${event.type}
      Goals: ${event.context.goals}
      ${event.context.attendees ? `Attendees: ${event.context.attendees.join(', ')}` : ''}
      ${event.context.location ? `Location: ${event.context.location}` : ''}
    `;

    // Prepare book notes
    const relevantBooks = books.filter(book => event.bookIds.includes(book.id));
    const bookNotes = relevantBooks.map(book => `
      Book: ${book.title} by ${book.author}
      Notes: ${book.userNotes}
    `);

    // Generate memo content
    const content = await aiService.generateMemo(
      eventContext,
      bookNotes,
      format
    );

    // Update memo with generated content
    await updateMemo(memoId, {
      content,
      status: 'generated',
    });

    return content;
  } catch (error) {
    console.error('Error generating memo:', error);
    if (error instanceof Error && memoId) {
      // Update memo with error status
      await updateMemo(memoId, {
        status: 'failed',
        content: `Failed to generate memo: ${error.message}`,
      });
    }
    throw error;
  }
} 