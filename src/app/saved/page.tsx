'use client';

import { useState } from 'react';
import { usePins, usePinsActions } from '@/contexts/PinsContext';
import { useSavedPinsSelection } from '@/hooks/useSavedPinsSelection';
import { SavedFilters } from '@/components/saved/SavedFilters';
import { SavedTags } from '@/components/saved/SavedTags';
import { SavedSelectionHeader } from '@/components/saved/SavedSelectionHeader';
import { SavedContent } from '@/components/saved/SavedContent';
import { SavedEmptyState } from '@/components/saved/SavedEmptyState';
import { useSavedPinsFilters } from '@/hooks/useSavedPinsFilters';
import { ViewMode } from '@/types/boards.types';
import { SavedHeader } from '@/components/saved/SavedHeader';

export default function SavedPage() {
  const { state } = usePins();
  const { unsavePin } = usePinsActions();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedPins,
    availableTags,
  } = useSavedPinsFilters(state.savedPins);

  const {
    selection,
    toggleSelectionMode,
    selectAll,
    togglePinSelection,
    clearSelection,
  } = useSavedPinsSelection();

  const hasSavedPins = state.savedPins.length > 0;
  const hasFilters = filters.searchQuery !== '' || filters.filterBy !== 'all';
  const isAllSelected =
    selection.selectedPins.length === filteredAndSortedPins.length &&
    filteredAndSortedPins.length > 0;

  // Handle bulk delete - exactly like original
  const handleBulkDelete = () => {
    selection.selectedPins.forEach(pinId => unsavePin(pinId));
    clearSelection();
    toggleSelectionMode();
  };

  // Handle selection mode toggle - exactly like original
  const handleToggleSelectionMode = () => {
    toggleSelectionMode();
    // Clear selections when toggling mode (like original)
    if (selection.isSelectionMode) {
      clearSelection();
    }
  };

  const handleClearSearch = () => {
    updateFilter('searchQuery', '');
  };

  const handleClearAllFilters = () => {
    clearFilters();
  };

  const handleTagClick = (tag: string) => {
    updateFilter('searchQuery', tag);
  };

  const handleSelectAll = () => {
    selectAll(filteredAndSortedPins);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header - Exactly like original */}
      <SavedHeader
        totalPins={state.savedPins.length}
        filteredCount={filteredAndSortedPins.length}
        selectedCount={selection.selectedPins.length}
        hasSavedPins={hasSavedPins}
        isSelectionMode={selection.isSelectionMode}
        viewMode={viewMode}
        onToggleSelectionMode={handleToggleSelectionMode}
        onBulkDelete={handleBulkDelete}
        onViewModeChange={setViewMode}
      />

      {/* Filters and Search - Only show if there are saved pins */}
      {hasSavedPins && (
        <>
          <SavedFilters filters={filters} onUpdateFilter={updateFilter} />

          {/* Tags Filter */}
          <SavedTags tags={availableTags} onTagClick={handleTagClick} />

          {/* Selection Header */}
          <SavedSelectionHeader
            isVisible={selection.isSelectionMode}
            isAllSelected={isAllSelected}
            totalCount={filteredAndSortedPins.length}
            onSelectAll={handleSelectAll}
          />
        </>
      )}

      {/* Content */}
      {filteredAndSortedPins.length > 0 ? (
        <SavedContent
          pins={filteredAndSortedPins}
          viewMode={viewMode}
          selectionMode={selection.isSelectionMode}
          selectedPins={selection.selectedPins}
          onSelectPin={togglePinSelection}
        />
      ) : (
        <SavedEmptyState
          hasFilters={hasSavedPins && hasFilters}
          onClearSearch={handleClearSearch}
          onClearFilters={handleClearAllFilters}
        />
      )}
    </div>
  );
}
