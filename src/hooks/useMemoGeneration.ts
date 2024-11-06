import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateMemoForEvent } from '@/src/lib/memoGeneration';
import type { Event } from '@/src/types/event';
import type { Book } from '@/src/types/book';
import type { MemoFormat } from '@/src/types/memo';

export function useMemoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateMemo = async (
    event: Event,
    books: Book[],
    format: MemoFormat,
    userId: string
  ) => {
    try {
      setIsGenerating(true);
      const content = await generateMemoForEvent(event, books, format, userId);
      
      toast({
        title: "Memo generated",
        description: "Your memo has been created successfully",
      });

      return content;
    } catch (error) {
      console.error('Error in memo generation:', error);
      toast({
        variant: "destructive",
        title: "Error generating memo",
        description: "Please try again later",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMemo,
    isGenerating,
  };
} 