import { Search, Bookmark, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedEmptyStateProps {
  hasFilters: boolean;
  onClearSearch: () => void;
  onClearFilters: () => void;
}

export function SavedEmptyState({
  hasFilters,
  onClearSearch,
  onClearFilters,
}: SavedEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-4">No pins found</h2>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filter criteria
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={onClearSearch}>
            Clear search
          </Button>
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
      <h2 className="text-xl font-bold mb-4">Nothing saved yet</h2>
      <p className="text-muted-foreground mb-6">
        Start exploring and save pins you love
      </p>
      <Button
        className="flex items-center gap-4 mx-auto"
        onClick={() => (window.location.href = '/')}
      >
        <Camera />
        Explore pins
      </Button>
    </div>
  );
}
