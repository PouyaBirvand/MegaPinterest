import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, TrendingUp } from 'lucide-react';
import { QuickActionButtonProps } from '@/types/home.types';

const ACTION_CONFIG = {
  refresh: {
    icon: Shuffle,
    label: 'Surprise me',
  },
  popular: {
    icon: TrendingUp,
    label: 'Popular',
  },
} as const;

export function QuickActionButton({
  variant,
  isActive,
  isLoading,
  onClick,
}: QuickActionButtonProps) {
  const config = ACTION_CONFIG[variant];
  const Icon = config.icon;

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      onClick={onClick}
      disabled={isLoading}
    >
      <Icon className="h-4 w-4 mr-2" />
      {config.label}
    </Button>
  );
}
