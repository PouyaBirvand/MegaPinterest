'use client';

import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProfileTab } from './tabs/ProfileTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { User } from '@/types/settings.types';
import { SettingsTabsList } from './tabs/SettingsTabsList';

interface SettingsContainerProps {
  user: User;
}

export const SettingsContainer: React.FC<SettingsContainerProps> = ({
  user,
}) => (
  <Tabs defaultValue="profile" className="space-y-6">
    <SettingsTabsList />

    <TabsContent value="profile">
      <ProfileTab user={user} />
    </TabsContent>

    <TabsContent value="notifications">
      <NotificationsTab />
    </TabsContent>

    <TabsContent value="appearance">
      <AppearanceTab />
    </TabsContent>

    <TabsContent value="privacy">
      <PrivacyTab />
    </TabsContent>
  </Tabs>
);
