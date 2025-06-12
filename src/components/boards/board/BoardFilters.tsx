'use client';

import { Search, Filter, SortAsc, Grid, List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BoardPageState, DateRange, SortOption } from '@/types/boardPage.types';

interface BoardFiltersProps {
  filters: BoardPageState;
  allTags: string[];
  hasActiveFilters: boolean;
  onUpdateFilters: (updates: Partial<BoardPageState>) => void;
  onClearFilters: () => void;
  totalPins: number;
  filteredCount: number;
}

export function BoardFilters({
  filters,
  allTags,
  hasActiveFilters,
  onUpdateFilters,
  onClearFilters,
  totalPins,
  filteredCount,
}: BoardFiltersProps) {
  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onUpdateFilters({ selectedTags: newTags });
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pins..."
              value={filters.searchQuery}
              onChange={e => onUpdateFilters({ searchQuery: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              onUpdateFilters({ showFilters: !filters.showFilters })
            }
            className={filters.showFilters ? 'bg-muted' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {filters.selectedTags.length +
                  (filters.dateRange !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value: SortOption) =>
              onUpdateFilters({ sortBy: value })
            }
          >
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">By title</SelectItem>
              <SelectItem value="mostLiked">Most liked</SelectItem>
            </SelectContent>
          </Select>
          <ViewModeToggle
            viewMode={filters.viewMode}
            onViewModeChange={viewMode => onUpdateFilters({ viewMode })}
          />
        </div>
      </div>

      {filters.showFilters && (
        <AdvancedFilters
          filters={filters}
          allTags={allTags}
          onUpdateFilters={onUpdateFilters}
          onToggleTag={toggleTag}
          onClearFilters={onClearFilters}
          totalPins={totalPins}
          filteredCount={filteredCount}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </div>
  );
}

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
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
  );
}

interface AdvancedFiltersProps {
  filters: BoardPageState;
  allTags: string[];
  onUpdateFilters: (updates: Partial<BoardPageState>) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  totalPins: number;
  filteredCount: number;
  hasActiveFilters: boolean;
}

function AdvancedFilters({
  filters,
  allTags,
  onUpdateFilters,
  onToggleTag,
  onClearFilters,
  totalPins,
  filteredCount,
  hasActiveFilters,
}: AdvancedFiltersProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTags.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={
                    filters.selectedTags.includes(tag) ? 'default' : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => onToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label className="text-sm font-medium mb-2 block">Date Range</Label>
          <Select
            value={filters.dateRange}
            onValueChange={(value: DateRange) =>
              onUpdateFilters({ dateRange: value })
            }
          >
            <SelectTrigger>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalPins} pins
          </span>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
