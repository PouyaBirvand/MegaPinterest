export const SETTINGS_TABS = {
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  APPEARANCE: 'appearance',
  PRIVACY: 'privacy',
} as const;

export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  email: true,
  push: false,
  marketing: false,
} as const;
