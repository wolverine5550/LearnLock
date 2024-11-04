'use client';

import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { auth } from "@/src/lib/firebase";

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try signing in again",
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return <ErrorBoundary>{children}</ErrorBoundary>;
} 