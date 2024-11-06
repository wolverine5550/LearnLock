'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  getUserNotificationPreferences,
  updateNotificationPreferences,
} from '@/src/lib/notifications';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/src/types/notifications';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { usePushNotifications } from '@/src/hooks/usePushNotifications';

export function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_NOTIFICATION_PREFERENCES);
  const { 
    isSupported, 
    isRegistered, 
    isRegistering,
    registerForPushNotifications,
    unregisterFromPushNotifications,
  } = usePushNotifications();

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        const prefs = await getUserNotificationPreferences(user.uid);
        if (prefs) {
          setPreferences(prefs);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        toast({
          variant: "destructive",
          title: "Error loading preferences",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  useEffect(() => {
    if (preferences.pushEnabled && !isRegistered && isSupported) {
      registerForPushNotifications();
    }
  }, [preferences.pushEnabled, isRegistered, isSupported]);

  const handlePushToggle = async (checked: boolean) => {
    if (checked && !isRegistered) {
      await registerForPushNotifications();
    } else if (!checked && isRegistered) {
      await unregisterFromPushNotifications();
    }
    
    setPreferences(prev => ({ ...prev, pushEnabled: checked }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await updateNotificationPreferences(user.uid, preferences);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Error saving preferences",
        description: "Please try again later",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications via email
              </div>
            </div>
            <Switch
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, emailEnabled: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <div className="text-sm text-muted-foreground">
                {isSupported 
                  ? "Receive browser push notifications" 
                  : "Push notifications are not supported in your browser"}
              </div>
            </div>
            <Switch
              checked={preferences.pushEnabled}
              onCheckedChange={handlePushToggle}
              disabled={!isSupported || isRegistering}
            />
          </div>

          <div className="space-y-2">
            <Label>Default Notification Time</Label>
            <Select
              value={preferences.notificationTime.toString()}
              onValueChange={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  notificationTime: parseInt(value),
                }))
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

          <div className="space-y-2">
            <Label>Notification Types</Label>
            <div className="space-y-2">
              {Object.entries(preferences.reminderTypes).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        reminderTypes: {
                          ...prev.reminderTypes,
                          [key]: checked,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 