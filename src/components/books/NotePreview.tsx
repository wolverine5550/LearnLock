'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from '@/lib/utils';

interface NotePreviewProps {
  content: string;
  previewLength?: number;
}

export function NotePreview({ content, previewLength = 200 }: NotePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Strip HTML tags for length calculation
  const plainText = content.replace(/<[^>]*>/g, '');
  const needsExpansion = plainText.length > previewLength;
  
  const previewContent = isExpanded ? content : (
    needsExpansion 
      ? content.slice(0, content.indexOf(' ', previewLength)) + '...'
      : content
  );

  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "prose prose-sm max-w-none",
          !isExpanded && needsExpansion && "line-clamp-3"
        )}
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
      {needsExpansion && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-2" />
              Show less
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-2" />
              Show more
            </>
          )}
        </Button>
      )}
    </div>
  );
} 