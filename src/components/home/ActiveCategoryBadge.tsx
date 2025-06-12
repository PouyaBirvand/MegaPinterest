import React from 'react';
import { Button } from '@/components/ui/button';

interface ActiveCategoryBadgeProps {
  category: string;
  onClear: () => void;
}

export function ActiveCategoryBadge({
  category,
  onClear,
}: ActiveCategoryBadgeProps) {
  if (!category) return null;

  return (
    <div className="text-center mb-4">
      <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
        <span className="text-sm font-medium">Showing: {category}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-auto p-1 hover:bg-primary/20"
          aria-label={`Clear ${category} filter`}
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
