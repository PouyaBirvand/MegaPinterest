import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onRetry: () => void;
}

export function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">No results found</h2>
        <p className="text-muted-foreground mb-6">
          Try searching for something else or browse our trending ideas.
        </p>
        <Button onClick={onRetry}>
          <Sparkles className="h-4 w-4 mr-2" />
          Explore trending
        </Button>
      </div>
    </div>
  );
}
