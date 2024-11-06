import { Timestamp } from 'firebase/firestore';

export type MemoFormat = 'bullet' | 'narrative' | 'framework';
export type MemoStatus = 'pending' | 'generated' | 'failed';

export interface Memo {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  format: MemoFormat;
  status: MemoStatus;
  bookIds: string[];
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