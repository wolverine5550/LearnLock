export interface NotificationPreferences {
    emailEnabled: boolean;
    pushEnabled: boolean;
    notificationTime: number; // hours before event
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderTypes: {
      eventUpcoming: boolean;
      memoGenerated: boolean;
      memoFailed: boolean;
    };
    channels: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  }
  
  export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    emailEnabled: true,
    pushEnabled: false,
    notificationTime: 24, // Default to 24 hours before
    emailNotifications: true,
    pushNotifications: false,
    reminderTypes: {
      eventUpcoming: true,
      memoGenerated: true,
      memoFailed: true,
    },
    channels: {
      email: true,
      push: false,
      inApp: true,
    },
  };