'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, SortAsc, Grid, List, Lock, Globe } from 'lucide-react';
import { SortOption, FilterOption, ViewMode } from '@/types/boards.types';

interface BoardsFiltersProps {
  searchQuery: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  viewMode: ViewMode;
  showFilters: boolean;
  totalBoards: number;
  filteredCount: number;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function BoardsFilters({
  searchQuery,
  sortBy,
  filterBy,
  viewMode,
  showFilters,
  totalBoards,
  filteredCount,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onViewModeChange,
  onToggleFilters,
  onClearFilters,
}: BoardsFiltersProps) {
  const hasActiveFilters = filterBy !== 'all' || searchQuery;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Sort and View Controls */}
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="alphabetical">A to Z</SelectItem>
              <SelectItem value="mostPins">Most pins</SelectItem>
            </SelectContent>
          </Select>

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

        {/* Search */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters Toggle */}
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              1
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('all')}
            >
              All boards
            </Button>
            <Button
              variant={filterBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('recent')}
            >
              Recent
            </Button>
            <Button
              variant={filterBy === 'private' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('private')}
            >
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Button>
            <Button
              variant={filterBy === 'public' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('public')}
            >
              <Globe className="h-3 w-3 mr-1" />
              Public
            </Button>
            <Button
              variant={filterBy === 'empty' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('empty')}
            >
              Empty
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Showing {filteredCount} of {totalBoards} boards
              </span>
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
