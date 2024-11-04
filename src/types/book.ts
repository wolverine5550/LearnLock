import { Timestamp } from 'firebase/firestore';

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  tags: string[];
  userNotes: string;
  dateAdded: Timestamp;
  lastUpdated: Timestamp;
}

export type NewBook = Omit<Book, 'id' | 'userId' | 'dateAdded' | 'lastUpdated'>; 