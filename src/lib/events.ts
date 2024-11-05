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
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { Event, NewEvent } from '@/src/types/event';

const EVENTS_COLLECTION = 'events';

export async function addEvent(userId: string, event: NewEvent): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...event,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.now()),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
}

export async function updateEvent(eventId: string, updates: Partial<NewEvent>): Promise<void> {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
} 