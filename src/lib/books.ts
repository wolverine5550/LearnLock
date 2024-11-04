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
import type { Book, NewBook } from '@/src/types/book';

const BOOKS_COLLECTION = 'books';

export async function addBook(userId: string, book: NewBook): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BOOKS_COLLECTION), {
      ...book,
      userId,
      dateAdded: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
}

export async function getUserBooks(userId: string): Promise<Book[]> {
  try {
    const q = query(
      collection(db, BOOKS_COLLECTION),
      where('userId', '==', userId),
      orderBy('dateAdded', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKS_COLLECTION, bookId));
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}

export async function updateBook(bookId: string, updates: Partial<NewBook>): Promise<void> {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
}