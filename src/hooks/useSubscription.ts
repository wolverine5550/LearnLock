import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useBooks } from '@/src/hooks/useBooks';
import { SUBSCRIPTION_TIERS, type UserSubscription } from '@/src/types/user';

export function useSubscription() {
  const { user } = useAuth();
  const { books } = useBooks();
  const [subscription, setSubscription] = useState<UserSubscription>(SUBSCRIPTION_TIERS.free);

  // In a real app, we'd fetch the subscription status from the backend
  useEffect(() => {
    if (!user) return;
    
    // Mock implementation - everyone is a free user for now
    setSubscription(SUBSCRIPTION_TIERS.free);
  }, [user]);

  // Check if user can add more books
  const canAddBooks = books.length < subscription.bookLimit;
  const remainingBooks = Math.max(0, subscription.bookLimit - books.length);

  return {
    subscription,
    canAddBooks,
    remainingBooks,
    isFreeTier: subscription.tier === 'free',
    features: subscription.features,
  };
} 