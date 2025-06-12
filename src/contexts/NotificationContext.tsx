'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationData } from '@/types/navigation';

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (
    notification: Omit<NotificationData, 'id' | 'createdAt'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationData[]>([
    // Mock data for demonstration
    {
      id: '1',
      title: 'New Like',
      message: 'Someone liked your pin "Beautiful Sunset"',
      type: 'like',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      pinId: 'pin-1',
    },
    {
      id: '2',
      title: 'New Follower',
      message: 'John Doe started following you',
      type: 'follow',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      userId: 'user-1',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback(
    (notification: Omit<NotificationData, 'id' | 'createdAt'>) => {
      const newNotification: NotificationData = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}
