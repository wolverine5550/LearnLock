'use client';

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/src/components/icons/GoogleIcon";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useState } from "react";
import { Spinner } from "@/src/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Successfully signed in",
        description: "Welcome to LearnLock!",
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSignIn}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner className="mr-2" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
} 