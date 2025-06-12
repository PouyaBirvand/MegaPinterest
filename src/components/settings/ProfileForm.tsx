import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/settings.types';

interface ProfileFormProps {
  user: User;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="name">Display Name</Label>
      <Input id="name" value={user.name || ''} disabled className="bg-muted" />
      <p className="text-xs text-muted-foreground">
        Name is managed by your Google account
      </p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={user.email || ''}
        disabled
        className="bg-muted"
      />
      <p className="text-xs text-muted-foreground">
        Email is managed by your Google account
      </p>
    </div>
  </div>
);
