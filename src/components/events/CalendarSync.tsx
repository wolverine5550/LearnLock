'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCalendarAuthUrl } from "@/src/lib/calendar";
import { CalendarIcon, Loader2Icon } from "lucide-react";

export function CalendarSync() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const authUrl = await getCalendarAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not connect to Google Calendar",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Connect Google Calendar
        </>
      )}
    </Button>
  );
} 