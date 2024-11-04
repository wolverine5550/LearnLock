'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, XIcon } from "lucide-react";

interface BookSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchField: 'all' | 'title' | 'author' | 'notes' | 'tags';
  onSearchFieldChange: (value: 'all' | 'title' | 'author' | 'notes' | 'tags') => void;
  sortBy: 'dateAdded' | 'title' | 'author';
  onSortChange: (value: 'dateAdded' | 'title' | 'author') => void;
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  searchStats: { total: number; titleMatches: number; noteMatches: number; } | null;
}

export function BookSearch({ 
  searchTerm, 
  onSearchChange,
  searchField,
  onSearchFieldChange,
  sortBy, 
  onSortChange,
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  searchStats,
}: BookSearchProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={searchField}
          onValueChange={(value: any) => onSearchFieldChange(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Search in..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="tags">Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {searchStats && searchTerm && (
        <div className="text-sm text-muted-foreground">
          Found {searchStats.total} results
          {searchStats.noteMatches > 0 && (
            <span className="ml-2">
              ({searchStats.noteMatches} in notes)
            </span>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onTagRemove(tag)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="sort-by" className="whitespace-nowrap">Sort by:</Label>
        <Select
          value={sortBy}
          onValueChange={(value) => 
            onSortChange(value as 'dateAdded' | 'title' | 'author')
          }
        >
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="filter-tag" className="ml-4 whitespace-nowrap">Filter by tag:</Label>
        <Select
          value=""
          onValueChange={onTagSelect}
        >
          <SelectTrigger id="filter-tag">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            {availableTags
              .filter(tag => !selectedTags.includes(tag))
              .map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 