'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/settings/LoadingSpinner';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsContainer } from '@/components/settings/SettingsContainer';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SettingsHeader />
        <SettingsContainer user={user} />
      </div>
    </div>
  );
}
