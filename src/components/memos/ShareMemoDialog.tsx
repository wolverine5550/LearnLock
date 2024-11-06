'use client';

import { useState } from 'react';
import { useShare } from '@/src/hooks/useShare';
import { useToast } from '@/hooks/use-toast';
import type { Memo } from '@/src/types/memo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2, Link, Mail, Twitter, Linkedin } from "lucide-react";

interface ShareMemoDialogProps {
  memo: Memo;
}

export function ShareMemoDialog({ memo }: ShareMemoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | undefined>(24);
  
  const { isSharing, shareViaEmail, shareViaSocial, copyLink } = useShare(memo);
  const { toast } = useToast();

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
      await shareViaEmail(recipientEmail, {
        isPublic,
        allowComments,
        expiresIn,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error sharing via email:', error);
    }
  };

  const handleSocialShare = async (platform: 'twitter' | 'linkedin') => {
    try {
      await shareViaSocial(platform, {
        isPublic,
        allowComments,
        expiresIn,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error sharing via social:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyLink({
        isPublic,
        allowComments,
        expiresIn,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error copying link:', error);
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
          <div className="space-y-2">
            <Label>Share Settings</Label>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Public Access</Label>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Allow Comments</Label>
              <Switch
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Expires In</Label>
              <Select
                value={expiresIn?.toString()}
                onValueChange={(value) => 
                  setExpiresIn(value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Never" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                  <SelectItem value="">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Share via Email</Label>
            <div className="flex items-center gap-2">
              <Input
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient's email"
                type="email"
              />
              <Button onClick={handleEmailShare} disabled={isSharing}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleCopyLink} disabled={isSharing}>
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              disabled={isSharing}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('linkedin')}
              disabled={isSharing}
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