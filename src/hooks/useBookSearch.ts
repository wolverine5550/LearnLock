import { useMemo, useState } from 'react';
import type { Book } from '@/src/types/book';

type SearchFields = 'all' | 'title' | 'author' | 'notes' | 'tags';

export function useBookSearch(books: Book[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<SearchFields>('all');

  const searchResults = useMemo(() => {
    if (!searchTerm) return books;

    const term = searchTerm.toLowerCase();
    
    return books.filter(book => {
      switch (searchField) {
        case 'title':
          return book.title.toLowerCase().includes(term);
        case 'author':
          return book.author.toLowerCase().includes(term);
        case 'notes':
          // Strip HTML tags for text search
          const plainNotes = book.userNotes.replace(/<[^>]*>/g, '').toLowerCase();
          return plainNotes.includes(term);
        case 'tags':
          return book.tags.some(tag => tag.toLowerCase().includes(term));
        case 'all':
        default:
          return (
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.userNotes.replace(/<[^>]*>/g, '').toLowerCase().includes(term) ||
            book.tags.some(tag => tag.toLowerCase().includes(term))
          );
      }
    });
  }, [books, searchTerm, searchField]);

  const searchStats = useMemo(() => {
    if (!searchTerm) return null;

    return {
      total: searchResults.length,
      titleMatches: searchResults.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      ).length,
      noteMatches: searchResults.filter(book => 
        book.userNotes.replace(/<[^>]*>/g, '').toLowerCase().includes(searchTerm.toLowerCase())
      ).length,
    };
  }, [searchResults, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    searchResults,
    searchStats,
  };
} 