import { Timestamp } from 'firebase/firestore';

export type EventType = 'meeting' | 'presentation' | 'interview' | 'other';

export interface Event {
  id: string;
  userId: string;
  bookIds: string[];
  title: string;
  date: Timestamp;
  type: EventType;
  context: {
    goals: string;
    attendees?: string[];
    location?: string;
  };
  memoPreferences: {
    format: 'bullet' | 'narrative' | 'framework';
    sendTime: number; // hours before event
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type NewEvent = Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 