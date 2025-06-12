import React from 'react';
import { Button } from '@/components/ui/button';

interface HomeErrorBoundaryProps {
  error: string;
  onRetry: () => void;
}

export function HomeErrorBoundary({ error, onRetry }: HomeErrorBoundaryProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}
