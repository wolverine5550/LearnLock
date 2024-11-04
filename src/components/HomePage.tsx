'use client';

import { useAuth } from "@/src/contexts/AuthContext";
import { useSubscription } from "@/src/hooks/useSubscription";
import { SignOutButton } from "@/src/components/auth/SignOutButton";
import { BookForm } from "@/src/components/books/BookForm";
import { BookList } from "@/src/components/books/BookList";
import { UpgradeDialog } from "@/src/components/subscription/UpgradeDialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HomePage() {
  const { user } = useAuth();
  const { subscription, canAddBooks, remainingBooks, isFreeTier } = useSubscription();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">Welcome, {user?.displayName}!</h1>
            <Badge variant={isFreeTier ? "secondary" : "default"}>
              {subscription.tier} tier
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {isFreeTier 
              ? `You can add ${remainingBooks} more book${remainingBooks !== 1 ? 's' : ''}`
              : 'Unlimited books available'}
          </p>
        </div>
        <div className="flex gap-4">
          {isFreeTier && !canAddBooks && <UpgradeDialog />}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canAddBooks}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Book</DialogTitle>
              </DialogHeader>
              <BookForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8">
        <BookList />
      </div>

      {isFreeTier && canAddBooks && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Want unlimited books?</h3>
              <p className="text-sm text-muted-foreground">
                Upgrade to premium to add unlimited books and unlock all features
              </p>
            </div>
            <UpgradeDialog />
          </div>
        </div>
      )}
    </div>
  );
} 