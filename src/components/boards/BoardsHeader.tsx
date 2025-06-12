import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Kanban, Trash2 } from 'lucide-react';

interface BoardsHeaderProps {
  totalBoards: number;
  filteredCount: number;
  selectedCount: number;
  onCreateBoard: () => void;
  onBulkDelete: () => void;
  showCreateButton: boolean;
}

export function BoardsHeader({
  totalBoards,
  filteredCount,
  selectedCount,
  onCreateBoard,
  onBulkDelete,
  showCreateButton,
}: BoardsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-1">
          <Kanban className="w-8 h-8" />
          Your boards
        </h1>
        <p className="text-muted-foreground mt-2">
          {filteredCount} of {totalBoards} board{totalBoards !== 1 ? 's' : ''}
          {selectedCount > 0 && (
            <>
              {' • '}
              <Badge variant="secondary" className="ml-1">
                {selectedCount} selected
              </Badge>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {selectedCount > 0 && (
          <Button variant="destructive" onClick={onBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedCount})
          </Button>
        )}

        {showCreateButton && (
          <Button onClick={onCreateBoard}>
            <Plus className="h-4 w-4 mr-2" />
            Create board
          </Button>
        )}
      </div>
    </div>
  );
}
