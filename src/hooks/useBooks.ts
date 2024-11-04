import { useState, useEffect, useMemo } from 'react';
import { getUserBooks } from '@/src/lib/books';
import type { Book } from '@/src/types/book';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'dateAdded' | 'title' | 'author'>('dateAdded');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBooks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedBooks = await getUserBooks(user.uid);
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        variant: "destructive",
        title: "Error loading books",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach(book => book.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter(book =>
        selectedTags.every(tag => book.tags.includes(tag))
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.userNotes?.toLowerCase().includes(searchLower) ||
          book.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'dateAdded':
        default:
          return b.dateAdded.toMillis() - a.dateAdded.toMillis();
      }
    });

    return result;
  }, [books, searchTerm, selectedTags, sortBy]);

  return {
    books: filteredAndSortedBooks,
    loading,
    refetch: fetchBooks,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    availableTags,
    selectedTags,
    addTag: (tag: string) => setSelectedTags([...selectedTags, tag]),
    removeTag: (tag: string) => setSelectedTags(selectedTags.filter(t => t !== tag)),
  };
} 