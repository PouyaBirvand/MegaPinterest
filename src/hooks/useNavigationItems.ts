'use client';

import { Home, Compass, Settings, User, Bookmark } from 'lucide-react';
import { NavigationItem } from '@/types/navigation';

export function useNavigationItems() {
  const navigationItems: NavigationItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/saved', label: 'Saved', icon: Bookmark },
  ];

  const userMenuItems: NavigationItem[] = [
    { href: '/profile', label: 'Your profile', icon: User },
    { href: '/boards', label: 'Your boards', icon: Bookmark },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return {
    navigationItems,
    userMenuItems,
  };
}
