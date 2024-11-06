'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/src/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useMemoGeneration } from "@/src/hooks/useMemoGeneration";
import { useMemos } from "@/src/hooks/useMemos";
import { useAuth } from "@/src/contexts/AuthContext";
import { Copy, Share2, RefreshCw } from "lucide-react";
import type { Event } from "@/src/types/event";
import type { Book } from "@/src/types/book";
import type { MemoFormat } from "@/src/types/memo";
import { ShareMemoDialog } from "@/src/components/memos/ShareMemoDialog";

interface MemoPreviewProps {
  event: Event;
  books: Book[];
  format: MemoFormat;
}

export function MemoPreview({ event, books, format }: MemoPreviewProps) {
  const { user } = useAuth();
  const { generateMemo, isGenerating } = useMemoGeneration();
  const { latestMemo, loading: memosLoading, refetch, markMemoAsViewed } = useMemos(event.id);
  const { toast } = useToast();

  useEffect(() => {
    if (latestMemo && !latestMemo.viewed) {
      markMemoAsViewed(latestMemo.id);
    }
  }, [latestMemo]);

  const handleGenerate = async () => {
    if (!user) return;

    try {
      await generateMemo(event, books, format, user.uid);
      refetch(); // Refresh memos after generation
      toast({
        title: "Memo generated",
        description: "Your memo has been created successfully",
      });
    } catch (error) {
      console.error('Error generating memo:', error);
    }
  };

  const handleCopy = async () => {
    if (!latestMemo?.content) return;

    try {
      await navigator.clipboard.writeText(latestMemo.content);
      toast({
        title: "Copied to clipboard",
        description: "Memo content has been copied",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again",
      });
    }
  };

  const handleShare = async () => {
    // Implement sharing functionality later
    toast({
      title: "Coming soon",
      description: "Sharing functionality will be available soon",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Event Memo</CardTitle>
          {latestMemo && latestMemo.regenerateCount && latestMemo.regenerateCount > 1 && (
            <Badge variant="secondary">
              Version {latestMemo.regenerateCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge>{format}</Badge>
          {latestMemo?.content && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {latestMemo && <ShareMemoDialog memo={latestMemo} />}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGenerate}
                disabled={isGenerating}
                title="Regenerate memo"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {memosLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner className="h-8 w-8 mb-4" />
            <p className="text-muted-foreground">Loading memo...</p>
          </div>
        ) : !latestMemo?.content && !isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              Generate a memo for your upcoming event
            </p>
            <Button onClick={handleGenerate}>Generate Memo</Button>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner className="h-8 w-8 mb-4" />
            <p className="text-muted-foreground">Generating your memo...</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: latestMemo?.content || '' }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 