import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types/settings.types';

interface ProfileAvatarProps {
  user: User;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => (
  <div className="flex items-center space-x-4">
    <Avatar className="h-20 w-20">
      <AvatarImage
        src={user.image || '/profile.png'}
        alt={user.name || 'Profile'}
      />
      <AvatarFallback className="text-2xl">
        {user.name?.charAt(0) || 'U'}
      </AvatarFallback>
    </Avatar>
    <div>
      <Button variant="outline" disabled>
        Change Photo
      </Button>
      <p className="text-sm text-muted-foreground mt-1">
        Profile photo is managed by Google
      </p>
    </div>
  </div>
);
