import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryButtonProps } from '@/types/home.types';

export function CategoryButton({
  category,
  isActive,
  isLoading,
  onClick,
}: CategoryButtonProps) {
  const Icon = category.icon;

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      onClick={() => onClick(category.id)}
      disabled={isLoading}
    >
      <Icon className="h-4 w-4 mr-2" />
      {category.label}
    </Button>
  );
}
