'use client';

import { useBooks } from "@/src/hooks/useBooks";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { DeleteBookDialog } from "@/src/components/books/DeleteBookDialog";
import { EditBookDialog } from "@/src/components/books/EditBookDialog";
import { BookSearch } from "@/src/components/books/BookSearch";
import { useBookSearch } from "@/src/hooks/useBookSearch";
import { NotePreview } from "@/src/components/books/NotePreview";

export function BookList() {
  const { 
    books, 
    loading, 
    refetch,
    sortBy,
    setSortBy,
    availableTags,
    selectedTags,
    addTag,
    removeTag,
  } = useBooks();

  const {
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    searchResults,
    searchStats,
  } = useBookSearch(books);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BookSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchField={searchField}
        onSearchFieldChange={setSearchField}
        sortBy={sortBy}
        onSortChange={setSortBy}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagSelect={addTag}
        onTagRemove={removeTag}
        searchStats={searchStats}
      />
      
      {searchResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? "No books found matching your search"
                : "No books added yet. Add your first book to get started!"}
            </p>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          {searchResults.map((book) => (
            <Card key={book.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <EditBookDialog book={book} onUpdate={refetch} />
                  <DeleteBookDialog
                    bookId={book.id}
                    bookTitle={book.title}
                    onDelete={refetch}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {book.userNotes && (
                  <div className="mb-4">
                    <NotePreview content={book.userNotes} />
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span>
                    Added {formatDistanceToNow(book.dateAdded.toDate(), { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 