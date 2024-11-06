import { Timestamp } from 'firebase/firestore';

export interface Memo {
  id: string;
  eventId: string;
  userId: string;
  title: string;
  content: string;
  format: 'bullet' | 'narrative' | 'framework';
  status: 'pending' | 'generated' | 'failed';
  generated: Timestamp;
  viewed: boolean;
  shared: boolean;
  lastUpdated: Timestamp;
}

export type NewMemo = Omit<
  Memo,
  'id' | 'content' | 'status' | 'generated' | 'lastUpdated'
> & {
  content?: string;
  status: 'pending';
}; 