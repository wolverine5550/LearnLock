'use client';

import { useAuth } from "@/src/contexts/AuthContext";
import { SignOutButton } from "@/src/components/auth/SignOutButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>LearnLock Dashboard</CardTitle>
          <CardDescription>
            Welcome, {user?.displayName}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  );
} 