import * as admin from 'firebase-admin';

export interface Event {
  id: string;
  userId: string;
  title: string;
  date: admin.firestore.Timestamp;
  memoPreferences: {
    sendTime: number;
  };
}

export interface UserPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  notificationTime: number;
  emailNotifications: boolean;
} 