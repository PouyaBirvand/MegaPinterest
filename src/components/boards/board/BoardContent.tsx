'use client';

import { Board, Pin } from '@/types';
import { BoardFilters } from './BoardFilters';
import { BoardPinsDisplay } from './BoardPinsDisplay';
import { EmptyBoardState } from './EmptyBoardState';
import { BoardPageState } from '@/types/boardPage.types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface BoardContentProps {
  board: Board;
  pins: Pin[];
  filters: BoardPageState;
  allTags: string[];
  hasActiveFilters: boolean;
  onUpdateFilters: (updates: Partial<BoardPageState>) => void;
  onClearFilters: () => void;
  onNavigate: (path: string) => void;
}

export function BoardContent({
  board,
  pins,
  filters,
  allTags,
  hasActiveFilters,
  onUpdateFilters,
  onClearFilters,
  onNavigate,
}: BoardContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {board.pins.length > 0 && (
        <BoardFilters
          filters={filters}
          allTags={allTags}
          hasActiveFilters={hasActiveFilters}
          onUpdateFilters={onUpdateFilters}
          onClearFilters={onClearFilters}
          totalPins={board.pins.length}
          filteredCount={pins.length}
        />
      )}

      {pins.length > 0 ? (
        <BoardPinsDisplay
          pins={pins}
          viewMode={filters.viewMode}
          searchQuery={filters.searchQuery}
          hasActiveFilters={hasActiveFilters}
        />
      ) : board.pins.length === 0 ? (
        <EmptyBoardState
          onCreatePin={() => onNavigate('/pin-builder')}
          onBrowsePins={() => onNavigate('/')}
        />
      ) : (
        <NoMatchingPinsState onClearFilters={onClearFilters} />
      )}
    </div>
  );
}

function NoMatchingPinsState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-4">No pins match your filters</h2>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    </div>
  );
}
