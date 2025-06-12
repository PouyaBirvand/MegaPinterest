'use client';

import { ArrowLeft, MoreHorizontal, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BoardHeaderProps {
  onBack: () => void;
  onShare: () => void;
  onOpenMenu: () => void;
}

export function BoardHeader({ onBack, onShare, onOpenMenu }: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-muted">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onShare}>
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenMenu}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
