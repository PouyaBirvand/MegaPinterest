'use client';

import { NotificationSettings } from '@/types/settings.types';
import { useState, useCallback } from 'react';

export const useNotificationSettings = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    marketing: false,
  });

  const updateNotification = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      setNotifications(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const saveNotifications = useCallback(async () => {
    try {
      // API call to save notifications
      console.log('Saving notifications:', notifications);
      // await api.saveNotifications(notifications);
    } catch (error) {
      console.error('Failed to save notifications:', error);
      throw error;
    }
  }, [notifications]);

  return {
    notifications,
    updateNotification,
    saveNotifications,
  };
};
