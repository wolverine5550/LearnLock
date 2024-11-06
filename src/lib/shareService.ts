import { createSharedMemo, updateSharedMemo } from '@/src/lib/share';
import type { Memo } from '@/src/types/memo';
import type { ShareOptions, ShareMethod } from '@/src/types/share';

export async function shareMemoViaEmail(
  memo: Memo,
  recipientEmail: string,
  options: Omit<ShareOptions, 'recipientEmail'>
): Promise<string> {
  try {
    const shareResponse = await createSharedMemo(memo, {
      ...options,
      recipientEmail,
    });

    // In a real app, you'd use an email service here
    // For now, we'll use mailto
    const subject = encodeURIComponent('Shared Memo from LearnLock');
    const body = encodeURIComponent(`
      Check out this memo: ${shareResponse.shareLink}
      
      ${memo.content}
    `);
    
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    return shareResponse.shareLink;
  } catch (error) {
    console.error('Error sharing memo via email:', error);
    throw error;
  }
}

export async function shareMemoViaSocial(
  memo: Memo,
  platform: 'twitter' | 'linkedin',
  options: ShareOptions
): Promise<string> {
  try {
    const shareResponse = await createSharedMemo(memo, options);
    const shareUrl = encodeURIComponent(shareResponse.shareLink);
    const text = encodeURIComponent('Check out this memo from LearnLock!');
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    };
    
    window.open(urls[platform], '_blank');
    return shareResponse.shareLink;
  } catch (error) {
    console.error('Error sharing memo via social:', error);
    throw error;
  }
}

export async function copyShareLink(
  memo: Memo,
  options: ShareOptions
): Promise<string> {
  try {
    const shareResponse = await createSharedMemo(memo, options);
    await navigator.clipboard.writeText(shareResponse.shareLink);
    return shareResponse.shareLink;
  } catch (error) {
    console.error('Error copying share link:', error);
    throw error;
  }
}

export async function trackShareAnalytics(
  shareId: string,
  method: ShareMethod
): Promise<void> {
  try {
    await updateSharedMemo(shareId, {
      shareMethod: method,
    });
  } catch (error) {
    console.error('Error tracking share analytics:', error);
    throw error;
  }
} 