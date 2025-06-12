import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Palette, Shield } from 'lucide-react';

const tabs = [
  { value: 'profile', icon: User, label: 'Profile' },
  { value: 'notifications', icon: Bell, label: 'Notifications' },
  { value: 'appearance', icon: Palette, label: 'Appearance' },
  { value: 'privacy', icon: Shield, label: 'Privacy' },
] as const;

export const SettingsTabsList: React.FC = () => (
  <TabsList className="grid w-full grid-cols-4">
    {tabs.map(({ value, icon: Icon, label }) => (
      <TabsTrigger
        key={value}
        value={value}
        className="flex items-center space-x-2"
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </TabsTrigger>
    ))}
  </TabsList>
);
