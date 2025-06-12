'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBoardStateProps {
  onCreatePin: () => void;
  onBrowsePins: () => void;
}

export function EmptyBoardState({
  onCreatePin,
  onBrowsePins,
}: EmptyBoardStateProps) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Plus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Nothing to show...yet!</h2>
        <p className="text-muted-foreground mb-8">
          Pins you add to this board will live here. Start building your
          collection!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onCreatePin} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Pin
          </Button>
          <Button variant="outline" onClick={onBrowsePins} size="lg">
            Browse Pins
          </Button>
        </div>
      </div>
    </div>
  );
}
