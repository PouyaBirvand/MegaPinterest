'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '@/types/navigation.types';

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  return (
    <nav className={className}>
      {items.map(item => (
        <Button key={item.href} variant="ghost" asChild>
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
