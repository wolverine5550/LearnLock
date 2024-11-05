import { SubscriptionTier, UserSubscription, SUBSCRIPTION_TIERS } from '@/src/types/subscription';

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  defaultReminderTime: number;
  lastUpdated: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  notificationPreferences: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export { SUBSCRIPTION_TIERS };
export type { SubscriptionTier, UserSubscription };