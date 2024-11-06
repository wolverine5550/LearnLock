import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  shareMemoViaEmail, 
  shareMemoViaSocial, 
  copyShareLink,
  trackShareAnalytics,
} from '@/src/lib/shareService';
import type { Memo } from '@/src/types/memo';
import type { ShareOptions } from '@/src/types/share';

export function useShare(memo: Memo) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const shareViaEmail = async (recipientEmail: string, options: Omit<ShareOptions, 'recipientEmail'>) => {
    try {
      setIsSharing(true);
      const shareLink = await shareMemoViaEmail(memo, recipientEmail, options);
      await trackShareAnalytics(memo.id, 'email');
      
      toast({
        title: "Memo shared",
        description: "Email has been opened in your default email client",
      });
      
      return shareLink;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing memo",
        description: "Please try again later",
      });
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const shareViaSocial = async (platform: 'twitter' | 'linkedin', options: ShareOptions) => {
    try {
      setIsSharing(true);
      const shareLink = await shareMemoViaSocial(memo, platform, options);
      await trackShareAnalytics(memo.id, platform === 'twitter' ? 'twitter' : 'linkedin');
      
      toast({
        title: "Share window opened",
        description: `Share on ${platform} window has been opened`,
      });
      
      return shareLink;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing memo",
        description: "Please try again later",
      });
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const copyLink = async (options: ShareOptions) => {
    try {
      setIsSharing(true);
      const shareLink = await copyShareLink(memo, options);
      await trackShareAnalytics(memo.id, 'link');
      
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
      
      return shareLink;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error copying link",
        description: "Please try again later",
      });
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    shareViaEmail,
    shareViaSocial,
    copyLink,
  };
} 