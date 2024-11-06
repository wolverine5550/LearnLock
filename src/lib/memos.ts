import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { Memo, NewMemo } from '@/src/types/memo';

const MEMOS_COLLECTION = 'memos';

export async function createMemo(userId: string, memo: NewMemo): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, MEMOS_COLLECTION), {
      ...memo,
      userId,
      status: 'pending',
      generated: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating memo:', error);
    throw error;
  }
}

export async function getMemosByEvent(eventId: string): Promise<Memo[]> {
  try {
    const q = query(
      collection(db, MEMOS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('generated', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Memo[];
  } catch (error) {
    console.error('Error getting memos:', error);
    throw error;
  }
}

export async function updateMemo(
  memoId: string,
  updates: Partial<Memo>
): Promise<void> {
  try {
    const memoRef = doc(db, MEMOS_COLLECTION, memoId);
    await updateDoc(memoRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating memo:', error);
    throw error;
  }
}

export async function deleteMemo(memoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MEMOS_COLLECTION, memoId));
  } catch (error) {
    console.error('Error deleting memo:', error);
    throw error;
  }
}

export async function updateMemoStatus(
  memoId: string,
  status: 'pending' | 'generated' | 'failed',
  content?: string
): Promise<void> {
  try {
    const updates: Partial<Memo> = {
      status,
      lastUpdated: Timestamp.now(),
    };

    if (content) {
      updates.content = content;
    }

    await updateDoc(doc(db, MEMOS_COLLECTION, memoId), updates);
  } catch (error) {
    console.error('Error updating memo status:', error);
    throw error;
  }
}

export async function trackMemoView(memoId: string): Promise<void> {
  try {
    await updateDoc(doc(db, MEMOS_COLLECTION, memoId), {
      viewed: true,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error tracking memo view:', error);
    throw error;
  }
}

export async function getLatestMemo(eventId: string): Promise<MemoWithStatus | null> {
  try {
    const q = query(
      collection(db, MEMOS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('generated', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      isLatest: true,
      regenerateCount: await getMemoRegenerateCount(eventId),
    } as MemoWithStatus;
  } catch (error) {
    console.error('Error getting latest memo:', error);
    throw error;
  }
}

async function getMemoRegenerateCount(eventId: string): Promise<number> {
  try {
    const q = query(
      collection(db, MEMOS_COLLECTION),
      where('eventId', '==', eventId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting memo count:', error);
    return 0;
  }
}

export type MemoWithStatus = Memo & {
  isLatest: boolean;
  regenerateCount: number;
}; 