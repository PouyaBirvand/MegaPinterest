'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchBarProps } from '@/types/navigation.types';

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSubmit,
  className,
  placeholder = 'Search for ideas',
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className={cn('flex-1 max-w-2xl', className)}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
    </form>
  );
}

interface MobileSearchBarProps extends SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchBar({
  searchQuery,
  onSearchChange,
  onSubmit,
  isOpen,
  onClose,
  placeholder = 'Search for ideas',
}: MobileSearchBarProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t bg-background p-4">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10 w-full"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
