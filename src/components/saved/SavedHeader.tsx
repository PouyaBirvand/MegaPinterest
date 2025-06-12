import {
  Bookmark,
  LucideAlignCenterHorizontal,
  Trash2,
  Grid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewMode } from '@/types/saved.types';

interface SavedHeaderProps {
  totalPins: number;
  filteredCount: number;
  selectedCount: number;
  hasSavedPins: boolean;
  isSelectionMode: boolean;
  viewMode: ViewMode;
  onToggleSelectionMode: () => void;
  onBulkDelete: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SavedHeader({
  totalPins,
  filteredCount,
  selectedCount,
  hasSavedPins,
  isSelectionMode,
  viewMode,
  onToggleSelectionMode,
  onBulkDelete,
  onViewModeChange,
}: SavedHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Bookmark className="h-8 w-8 mr-3 text-primary" />
          Saved pins
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-muted-foreground">
            {filteredCount} of {totalPins} pins
          </p>
          {selectedCount > 0 && (
            <Badge variant="secondary">{selectedCount} selected</Badge>
          )}
        </div>
      </div>

      {/* Action Buttons - Only show if there are saved pins */}
      {hasSavedPins && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selection Mode Toggle */}
          <Button
            variant={isSelectionMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleSelectionMode}
          >
            <LucideAlignCenterHorizontal className="h-4 w-4 mr-2" />
            Select
          </Button>

          {/* Bulk Actions */}
          {isSelectionMode && selectedCount > 0 && (
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedCount})
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
