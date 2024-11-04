'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS } from "@/src/types/user";
import { CheckIcon } from "lucide-react";

export function UpgradeDialog() {
  const handleUpgrade = async () => {
    // In a real app, this would integrate with a payment provider
    console.log('Upgrade clicked - would integrate with payment provider');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Unlock all features and add unlimited books
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Premium Features:</h3>
            <ul className="grid gap-2">
              {SUBSCRIPTION_TIERS.premium.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 