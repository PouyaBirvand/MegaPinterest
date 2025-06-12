import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { useNotificationSettings } from '@/hooks/useNotificationsSettings';

const notificationOptions = [
  {
    key: 'email' as const,
    title: 'Email Notifications',
    description: 'Receive email updates about your pins and boards',
  },
  {
    key: 'push' as const,
    title: 'Push Notifications',
    description: 'Get notified about activity on your pins',
  },
  {
    key: 'marketing' as const,
    title: 'Marketing Emails',
    description: 'Receive tips, trends, and promotional content',
  },
];

export const NotificationsTab: React.FC = () => {
  const { notifications, updateNotification, saveNotifications } =
    useNotificationSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option, index) => (
            <React.Fragment key={option.key}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{option.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Switch
                  checked={notifications[option.key]}
                  onCheckedChange={checked =>
                    updateNotification(option.key, checked)
                  }
                />
              </div>
              {index < notificationOptions.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
        <div className="pt-4">
          <Button onClick={saveNotifications}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
