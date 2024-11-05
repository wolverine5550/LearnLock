'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BellIcon, MailIcon, Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserPreferences, updateUserPreferences } from '@/src/lib/userPreferences';

interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  defaultReminderTime: number;
}

export function NotificationPreferences() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    defaultReminderTime: 24,
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        const prefs = await getUserPreferences(user.uid);
        if (prefs) {
          setSettings({
            emailEnabled: prefs.emailEnabled,
            pushEnabled: prefs.pushEnabled,
            defaultReminderTime: prefs.defaultReminderTime,
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load preferences",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserPreferences(user.uid, settings);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences",
      });
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BellIcon className="mr-2 h-4 w-4" />
          Notification Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive event reminders via email
              </div>
            </div>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailEnabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </div>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Default Reminder Time</Label>
            <Select
              value={settings.defaultReminderTime.toString()}
              onValueChange={(value) =>
                setSettings({ ...settings, defaultReminderTime: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour before</SelectItem>
                <SelectItem value="2">2 hours before</SelectItem>
                <SelectItem value="24">24 hours before</SelectItem>
                <SelectItem value="48">48 hours before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 