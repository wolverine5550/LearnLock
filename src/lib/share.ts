import { updateMemo } from '@/src/lib/memos';
import type { Memo } from '@/src/types/memo';

export async function generateShareableLink(memo: Memo): Promise<string> {
  // In a real app, we might:
  // 1. Generate a unique token
  // 2. Store it in the database
  // 3. Create an expiring link
  
  // For now, we'll create a simple share URL
  const shareUrl = `${window.location.origin}/shared/memos/${memo.id}`;
  
  // Mark memo as shared
  await updateMemo(memo.id, { shared: true });
  
  return shareUrl;
}

export async function shareViaEmail(memo: Memo, recipientEmail: string): Promise<void> {
  // In a real app, we'd use an email service
  // For now, we'll use mailto
  const subject = encodeURIComponent('Shared Memo from LearnLock');
  const body = encodeURIComponent(`
    Check out this memo: ${window.location.origin}/shared/memos/${memo.id}
    
    ${memo.content}
  `);
  
  window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

export async function shareViaSocialMedia(memo: Memo, platform: 'twitter' | 'linkedin'): Promise<void> {
  const url = encodeURIComponent(`${window.location.origin}/shared/memos/${memo.id}`);
  const text = encodeURIComponent('Check out this memo from LearnLock!');
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  };
  
  window.open(shareUrls[platform], '_blank');
} 