import React from 'react';
import { Button } from '@/components/ui/button';
import { Pin, TrendingUp, Shuffle } from 'lucide-react';

interface EmptyStateProps {
  activeCategory?: string;
  onRetry: () => void;
}

export function EmptyState({ activeCategory, onRetry }: EmptyStateProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl flex items-center justify-center gap-3 font-bold mb-4">
          {activeCategory ? `No ${activeCategory} pins found` : 'No pins found'}
          <Pin />
        </h2>
        <p className="text-muted-foreground mb-6">
          {activeCategory
            ? `Try searching for different ${activeCategory} ideas or browse other categories.`
            : 'Try searching for something else or check your internet connection.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={onRetry}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Show Popular
          </Button>
          {activeCategory && (
            <Button variant="outline" onClick={handleRefresh}>
              <Shuffle className="h-4 w-4 mr-2" />
              Try Random
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
