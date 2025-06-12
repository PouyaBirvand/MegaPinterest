import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface BoardsEmptyStateProps {
  type: 'no-boards' | 'no-results';
  onCreateBoard: () => void;
  onClearFilters?: () => void;
  searchQuery?: string;
  filterBy?: string;
}

export function BoardsEmptyState({
  type,
  onCreateBoard,
  onClearFilters,
  searchQuery,
  filterBy,
}: BoardsEmptyStateProps) {
  if (type === 'no-boards') {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-4">Create your first board</h2>
          <p className="text-muted-foreground mb-8">
            Boards are a great way to organize your pins. Create one to get
            started!
          </p>
          <Button onClick={onCreateBoard} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-4">No boards found</h2>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
          <Button onClick={onCreateBoard}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>
      </div>
    </div>
  );
}
