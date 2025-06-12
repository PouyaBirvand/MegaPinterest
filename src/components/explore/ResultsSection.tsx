import { Button } from '@/components/ui/button';
import { MasonryGrid } from '@/components/pin/MasonryGrid';
import { LoadingSkeleton } from '@/components/explore/LoadingSkeleton';
import { EmptyState } from '@/components/explore/EmptyState';
import { Pin } from '@/types';

interface ResultsSectionProps {
  pins: Pin[];
  loading: boolean;
  hasMore: boolean;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  totalCount: number;
  onLoadMore: () => void;
  onClearFilter: () => void;
  onRetry: () => void;
}

export function ResultsSection({
  pins,
  loading,
  hasMore,
  selectedCategory,
  searchQuery,
  sortBy,
  totalCount,
  onLoadMore,
  onClearFilter,
  onRetry,
}: ResultsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      {selectedCategory && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedCategory} ideas</h2>
            <Button variant="outline" onClick={onClearFilter}>
              Clear filter
            </Button>
          </div>
        </div>
      )}

      {totalCount > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalCount} pins found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <p className="text-sm text-muted-foreground">Sorted by {sortBy}</p>
        </div>
      )}

      {pins.length > 0 ? (
        <MasonryGrid
          pins={pins}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        />
      ) : loading ? (
        <LoadingSkeleton />
      ) : (
        <EmptyState onRetry={onRetry} />
      )}
    </section>
  );
}
