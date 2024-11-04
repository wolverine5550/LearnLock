'use client';

import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useState } from "react";
import { Spinner } from "@/src/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      toast({
        title: "Successfully signed out",
        description: "See you next time!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          Signing out...
        </>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
} 