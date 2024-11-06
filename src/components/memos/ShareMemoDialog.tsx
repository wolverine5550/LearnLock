'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Share2, Link, Mail, Twitter, Linkedin } from "lucide-react";
import { 
  generateShareableLink, 
  shareViaEmail, 
  shareViaSocialMedia 
} from '@/src/lib/share';
import type { Memo } from '@/src/types/memo';

interface ShareMemoDialogProps {
  memo: Memo;
}

export function ShareMemoDialog({ memo }: ShareMemoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      const shareableLink = await generateShareableLink(memo);
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy link",
        description: "Please try again",
      });
    }
  };

  const handleEmailShare = async () => {
    if (!recipientEmail) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter a recipient email",
      });
      return;
    }

    try {
      await shareViaEmail(memo, recipientEmail);
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to share",
        description: "Please try again",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Share memo"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Memo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              type="email"
            />
            <Button onClick={handleEmailShare}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleCopyLink}>
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaSocialMedia(memo, 'twitter')}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaSocialMedia(memo, 'linkedin')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 