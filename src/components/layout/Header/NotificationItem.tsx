'use client';

import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Settings, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationData } from '@/types/navigation.types';

interface NotificationItemProps {
  notification: NotificationData;
}

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  system: Settings,
};

const colorMap = {
  like: 'text-red-500',
  comment: 'text-blue-500',
  follow: 'text-green-500',
  system: 'text-gray-500',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotifications();
  const Icon = iconMap[notification.type];

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(notification.id);
  };

  return (
    <div
      className={cn(
        'p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group',
        !notification.isRead && 'bg-blue-50 dark:bg-blue-950/20'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-1', colorMap[notification.type])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
