import { useState, useEffect } from 'react';
import { 
  getMemosByEvent, 
  getLatestMemo, 
  trackMemoView,
  type MemoWithStatus 
} from '@/src/lib/memos';
import { useToast } from '@/hooks/use-toast';

export function useMemos(eventId: string) {
  const [memos, setMemos] = useState<MemoWithStatus[]>([]);
  const [latestMemo, setLatestMemo] = useState<MemoWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const [fetchedMemos, latest] = await Promise.all([
        getMemosByEvent(eventId),
        getLatestMemo(eventId),
      ]);

      setMemos(fetchedMemos.map(memo => ({
        ...memo,
        isLatest: memo.id === latest?.id,
        regenerateCount: latest?.regenerateCount || 0,
      })));
      
      setLatestMemo(latest);
    } catch (error) {
      console.error('Error fetching memos:', error);
      toast({
        variant: "destructive",
        title: "Error loading memos",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const markMemoAsViewed = async (memoId: string) => {
    try {
      await trackMemoView(memoId);
      setMemos(prevMemos => 
        prevMemos.map(memo => 
          memo.id === memoId 
            ? { ...memo, viewed: true }
            : memo
        )
      );
    } catch (error) {
      console.error('Error marking memo as viewed:', error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, [eventId]);

  return {
    memos,
    latestMemo,
    loading,
    refetch: fetchMemos,
    markMemoAsViewed,
  };
} 