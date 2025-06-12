export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export type ThemeType = 'light' | 'dark' | 'system';

export interface SettingsTabProps {
  user: User;
}
