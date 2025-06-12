'use client';

import { useState } from 'react';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useProfileAuth } from '@/hooks/useProfileAuth';
import { useProfileData } from '@/hooks/useProfileData';
import type { ProfileTab } from '@/types/profile.types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileLoadingSpinner from '@/components/profile/ProfileLoadingSpinner';

export default function ProfilePage() {
  const { user, isLoading } = useProfileAuth();
  const { boards, savedPins, userStats } = useProfileData();
  const [activeTab, setActiveTab] = useState<ProfileTab>('created');

  if (isLoading) {
    return <ProfileLoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader user={user} userStats={userStats} />
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        boards={boards}
        savedPins={savedPins}
      />
    </div>
  );
}
