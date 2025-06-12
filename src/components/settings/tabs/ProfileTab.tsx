import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileAvatar } from '../ProfileAvatar';
import { ProfileForm } from '../ProfileForm';
import { AccountActions } from '../AccountActions';
import { SettingsTabProps } from '@/types/settings.types';

export const ProfileTab: React.FC<SettingsTabProps> = ({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
      <CardDescription>
        Update your profile information and settings
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <ProfileAvatar user={user} />
      <Separator />
      <ProfileForm user={user} />
      <Separator />
      <AccountActions />
    </CardContent>
  </Card>
);
