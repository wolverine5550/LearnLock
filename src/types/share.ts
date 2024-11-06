import type { Timestamp } from 'firebase/firestore';

export type ShareMethod = 'email' | 'twitter' | 'linkedin' | 'link';

export interface SharedMemo {
  id: string;
  memoId: string;
  userId: string;
  shareMethod: ShareMethod;
  sharedAt: Timestamp;
  expiresAt?: Timestamp;
  accessCount: number;
  shareLink: string;
  isPublic: boolean;
  allowComments: boolean;
  recipientEmail?: string;
  lastAccessed?: Timestamp;
}

export interface ShareOptions {
  expiresIn?: number; // hours
  isPublic: boolean;
  allowComments: boolean;
  recipientEmail?: string;
}

export interface ShareResponse {
  shareId: string;
  shareLink: string;
  expiresAt?: Timestamp;
} 