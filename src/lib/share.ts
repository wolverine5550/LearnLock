import { 
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { nanoid } from 'nanoid';
import type { SharedMemo, ShareOptions, ShareResponse } from '@/src/types/share';
import type { Memo } from '@/src/types/memo';

const SHARED_MEMOS_COLLECTION = 'sharedMemos';

export async function createSharedMemo(
  memo: Memo,
  options: ShareOptions
): Promise<ShareResponse> {
  try {
    const shareId = nanoid(10); // Generate short unique ID for share link
    const shareLink = `${window.location.origin}/shared/${shareId}`;

    const sharedMemoData: Omit<SharedMemo, 'id'> = {
      memoId: memo.id,
      userId: memo.userId,
      shareMethod: options.recipientEmail ? 'email' : 'link',
      sharedAt: Timestamp.now(),
      expiresAt: options.expiresIn 
        ? Timestamp.fromMillis(Date.now() + options.expiresIn * 60 * 60 * 1000)
        : undefined,
      accessCount: 0,
      shareLink,
      isPublic: options.isPublic,
      allowComments: options.allowComments,
      recipientEmail: options.recipientEmail,
    };

    const docRef = await addDoc(collection(db, SHARED_MEMOS_COLLECTION), sharedMemoData);

    return {
      shareId: docRef.id,
      shareLink,
      expiresAt: sharedMemoData.expiresAt,
    };
  } catch (error) {
    console.error('Error creating shared memo:', error);
    throw error;
  }
}

export async function getSharedMemo(shareId: string): Promise<SharedMemo | null> {
  try {
    const docRef = doc(db, SHARED_MEMOS_COLLECTION, shareId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const sharedMemo = { id: docSnap.id, ...docSnap.data() } as SharedMemo;

    // Check if share has expired
    if (sharedMemo.expiresAt && sharedMemo.expiresAt.toMillis() < Date.now()) {
      return null;
    }

    // Update access count and last accessed
    await updateDoc(docRef, {
      accessCount: increment(1),
      lastAccessed: serverTimestamp(),
    });

    return sharedMemo;
  } catch (error) {
    console.error('Error getting shared memo:', error);
    throw error;
  }
}

export async function updateSharedMemo(
  shareId: string,
  updates: Partial<SharedMemo>
): Promise<void> {
  try {
    const docRef = doc(db, SHARED_MEMOS_COLLECTION, shareId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating shared memo:', error);
    throw error;
  }
} 