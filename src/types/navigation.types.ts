import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface UserMenuProps {
  user: any;
  onSignOut: () => Promise<void>;
  userMenuItems: NavigationItem[];
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  navigationItems: NavigationItem[];
  userMenuItems: NavigationItem[];
  onSignIn: () => void;
  onSignOut: () => Promise<void>;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  isLoading: boolean;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  placeholder?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  isRead: boolean;
  createdAt: Date;
  userId?: string;
  pinId?: string;
}
