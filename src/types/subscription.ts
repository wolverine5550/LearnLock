export type SubscriptionTier = 'free' | 'premium';

export interface UserSubscription {
  tier: SubscriptionTier;
  bookLimit: number;
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, UserSubscription> = {
  free: {
    tier: 'free',
    bookLimit: 1,
    features: ['Add one book', 'Basic notes', 'Basic memos'],
  },
  premium: {
    tier: 'premium',
    bookLimit: Infinity,
    features: ['Unlimited books', 'Advanced notes', 'Priority memos', 'Calendar integration'],
  },
}; 