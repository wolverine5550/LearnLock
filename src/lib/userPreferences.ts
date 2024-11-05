import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { NotificationPreferences, UserProfile } from '@/src/types/user';

export async function getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().notificationPreferences;
    }
    return null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'notificationPreferences': {
        ...preferences,
        lastUpdated: new Date(),
      },
      'updatedAt': new Date(),
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
} 