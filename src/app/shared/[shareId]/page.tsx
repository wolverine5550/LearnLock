import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getSharedMemo } from '@/src/lib/share';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { SharedMemoView } from '@/src/components/memos/SharedMemoView';
import { Spinner } from "@/src/components/ui/spinner";
import { Memo } from '@/src/types/memo';

interface SharedMemoPageProps {
  params: {
    shareId: string;
  };
}

async function getSharedMemoData(shareId: string) {
  const sharedMemo = await getSharedMemo(shareId);
  if (!sharedMemo) return null;

  const memoDoc = await getDoc(doc(db, 'memos', sharedMemo.memoId));
  if (!memoDoc.exists()) return null;

  const memoData = memoDoc.data();
  return {
    sharedMemo,
    memo: {
      id: memoDoc.id,
      eventId: memoData.eventId,
      userId: memoData.userId,
      title: memoData.title,
      content: memoData.content,
      format: memoData.format,
      status: memoData.status,
      generated: memoData.generated,
      viewed: memoData.viewed,
      shared: memoData.shared,
      lastUpdated: memoData.lastUpdated,
    } as Memo,
  };
}

export default async function SharedMemoPage({ params }: SharedMemoPageProps) {
  const data = await getSharedMemoData(params.shareId);

  if (!data) {
    notFound();
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex justify-center p-8">
          <Spinner className="h-8 w-8" />
        </div>
      }>
        <SharedMemoView 
          sharedMemo={data.sharedMemo} 
          memo={data.memo} 
        />
      </Suspense>
    </div>
  );
} 