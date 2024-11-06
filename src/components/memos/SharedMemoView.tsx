'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/src/components/ui/spinner";
import { formatDistanceToNow } from 'date-fns';
import type { SharedMemo } from '@/src/types/share';
import type { Memo } from '@/src/types/memo';

interface SharedMemoViewProps {
  sharedMemo: SharedMemo;
  memo: Memo;
}

export function SharedMemoView({ sharedMemo, memo }: SharedMemoViewProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (sharedMemo.expiresAt) {
      const timeLeft = sharedMemo.expiresAt.toMillis() - Date.now();
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          toast({
            title: "Share expired",
            description: "This shared memo is no longer accessible",
          });
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    }
  }, [sharedMemo.expiresAt]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{memo.title}</CardTitle>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>
              Shared {formatDistanceToNow(sharedMemo.sharedAt.toDate(), { addSuffix: true })}
            </span>
            {sharedMemo.expiresAt && (
              <Badge variant="secondary">
                Expires {formatDistanceToNow(sharedMemo.expiresAt.toDate(), { addSuffix: true })}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: memo.content }} />
        </div>
      </CardContent>
    </Card>
  );
} 