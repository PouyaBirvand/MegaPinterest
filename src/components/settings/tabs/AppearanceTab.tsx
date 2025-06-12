import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { ThemeType } from '@/types/settings.types';

const themeOptions = [
  { value: 'light' as ThemeType, icon: Sun, label: 'Light' },
  { value: 'dark' as ThemeType, icon: Moon, label: 'Dark' },
  { value: 'system' as ThemeType, icon: Monitor, label: 'System' },
];

export const AppearanceTab: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how Pinterest looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-4 block">Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={theme === value ? 'default' : 'outline'}
                  onClick={() => setTheme(value)}
                  className="h-20 flex-col space-y-2"
                >
                  <Icon className="h-6 w-6" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-base font-medium">Display Options</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show more pins in less space
                </p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
