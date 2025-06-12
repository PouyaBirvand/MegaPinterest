'use client';

import React from 'react';
import { useBoards } from '@/contexts/BoardsContext';
import { useBoardsPageState } from '@/hooks/useBoardsPageState';
import { useBoardDialogs } from '@/hooks/useBoardDialogs';
import { useBoardFiltering } from '@/hooks/useBoardFiltering';
import { useBoardActions } from '@/hooks/useBoardActions';

// Components
import { BoardsHeader } from '@/components/boards/BoardsHeader';
import { BoardsFilters } from '@/components/boards/BoardsFilters';
import { BoardsGrid } from '@/components/boards/BoardsGrid';
import { BoardsList } from '@/components/boards/BoardsList';
import { BoardsEmptyState } from '@/components/boards/BoardsEmptyState';
import { BoardsLoadingSkeleton } from '@/components/boards/BoardsLoadingSkeleton';
import { CreateBoardDialog } from '@/components/boards/CreateBoardDialog';
import { EditBoardDialog } from '@/components/boards/EditBoardDialog';
import { BulkActionsBar } from '@/components/boards/BulkActionsBar';

export default function BoardsPage() {
  const { state } = useBoards();

  // Custom hooks
  const pageState = useBoardsPageState();
  const dialogs = useBoardDialogs();
  const boardActions = useBoardActions();

  // Filtered boards
  const filteredBoards = useBoardFiltering(
    state.boards,
    pageState.searchQuery,
    pageState.sortBy,
    pageState.filterBy
  );

  // Loading state
  if (!state.initialized) {
    return <BoardsLoadingSkeleton />;
  }

  // Event handlers
  const handleCreateBoard = () => {
    boardActions.handleCreateBoard(
      dialogs.newBoardTitle,
      dialogs.newBoardDescription,
      dialogs.isPrivate,
      loading => dialogs.setLoading('isCreating', loading),
      dialogs.closeCreateDialog
    );
  };

  const handleUpdateBoard = () => {
    if (!dialogs.editingBoard) return;

    boardActions.handleUpdateBoard(
      dialogs.editingBoard,
      dialogs.editTitle,
      dialogs.editDescription,
      dialogs.editIsPrivate,
      loading => dialogs.setLoading('isUpdating', loading),
      dialogs.closeEditDialog
    );
  };

  const handleBulkDelete = () => {
    boardActions.handleBulkDelete(pageState.selectedBoards, () =>
      pageState.setSelectedBoards([])
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <BoardsHeader
          totalBoards={state.boards.length}
          filteredCount={filteredBoards.length}
          selectedCount={pageState.selectedBoards.length}
          onCreateBoard={dialogs.openCreateDialog}
          onBulkDelete={handleBulkDelete}
          showCreateButton={
            state.boards.length > 0 && filteredBoards.length > 0
          }
        />

        {/* Filters */}
        {state.boards.length > 0 && (
          <BoardsFilters
            searchQuery={pageState.searchQuery}
            sortBy={pageState.sortBy}
            filterBy={pageState.filterBy}
            viewMode={pageState.viewMode}
            showFilters={pageState.showFilters}
            totalBoards={state.boards.length}
            filteredCount={filteredBoards.length}
            onSearchChange={pageState.setSearchQuery}
            onSortChange={pageState.setSortBy}
            onFilterChange={pageState.setFilterBy}
            onViewModeChange={pageState.setViewMode}
            onToggleFilters={pageState.toggleFilters}
            onClearFilters={pageState.clearFilters}
          />
        )}
      </div>

      {/* Content */}
      <BoardsContent
        boards={filteredBoards}
        totalBoards={state.boards.length}
        viewMode={pageState.viewMode}
        selectedBoards={pageState.selectedBoards}
        searchQuery={pageState.searchQuery}
        filterBy={pageState.filterBy}
        onToggleSelection={pageState.toggleBoardSelection}
        onClearSelection={() => pageState.setSelectedBoards([])}
        onCreateBoard={dialogs.openCreateDialog}
        onEditBoard={dialogs.openEditDialog}
        onDeleteBoard={boardActions.handleDeleteBoard}
        onDuplicateBoard={boardActions.handleDuplicateBoard}
        onBulkDelete={handleBulkDelete}
        onClearFilters={pageState.clearFilters}
      />

      {/* Dialogs */}
      <CreateBoardDialog
        open={dialogs.showCreateDialog}
        title={dialogs.newBoardTitle}
        description={dialogs.newBoardDescription}
        isPrivate={dialogs.isPrivate}
        isCreating={dialogs.isCreating}
        onOpenChange={dialogs.closeCreateDialog}
        onTitleChange={value => dialogs.updateFormField('newBoardTitle', value)}
        onDescriptionChange={value =>
          dialogs.updateFormField('newBoardDescription', value)
        }
        onPrivateChange={value => dialogs.updateFormField('isPrivate', value)}
        onSubmit={handleCreateBoard}
      />

      <EditBoardDialog
        open={dialogs.showEditDialog}
        title={dialogs.editTitle}
        description={dialogs.editDescription}
        isPrivate={dialogs.editIsPrivate}
        isUpdating={dialogs.isUpdating}
        onOpenChange={dialogs.closeEditDialog}
        onTitleChange={value => dialogs.updateFormField('editTitle', value)}
        onDescriptionChange={value =>
          dialogs.updateFormField('editDescription', value)
        }
        onPrivateChange={value =>
          dialogs.updateFormField('editIsPrivate', value)
        }
        onSubmit={handleUpdateBoard}
      />
    </div>
  );
}

// Content component for better organization
interface BoardsContentProps {
  boards: any[];
  totalBoards: number;
  viewMode: 'grid' | 'list';
  selectedBoards: string[];
  searchQuery: string;
  filterBy: string;
  onToggleSelection: (boardId: string) => void;
  onClearSelection: () => void;
  onCreateBoard: () => void;
  onEditBoard: (board: any) => void;
  onDeleteBoard: (boardId: string, boardTitle: string) => void;
  onDuplicateBoard: (board: any) => void;
  onBulkDelete: () => void;
  onClearFilters: () => void;
}

function BoardsContent({
  boards,
  totalBoards,
  viewMode,
  selectedBoards,
  searchQuery,
  filterBy,
  onToggleSelection,
  onClearSelection,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
  onDuplicateBoard,
  onBulkDelete,
  onClearFilters,
}: BoardsContentProps) {
  // Show bulk actions bar if boards are selected
  const showBulkActions = selectedBoards.length > 0;

  // No boards at all
  if (totalBoards === 0) {
    return <BoardsEmptyState type="no-boards" onCreateBoard={onCreateBoard} />;
  }

  // No filtered results
  if (boards.length === 0) {
    return (
      <BoardsEmptyState
        type="no-results"
        onCreateBoard={onCreateBoard}
        onClearFilters={onClearFilters}
        searchQuery={searchQuery}
        filterBy={filterBy}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActionsBar
          selectedCount={selectedBoards.length}
          onClearSelection={onClearSelection}
          onBulkDelete={onBulkDelete}
        />
      )}

      {/* Boards Grid/List */}
      {viewMode === 'grid' ? (
        <BoardsGrid
          boards={boards}
          selectedBoards={selectedBoards}
          onToggleSelection={onToggleSelection}
          onEditBoard={onEditBoard}
          onDeleteBoard={onDeleteBoard}
          onDuplicateBoard={onDuplicateBoard}
        />
      ) : (
        <BoardsList
          boards={boards}
          selectedBoards={selectedBoards}
          onToggleSelection={onToggleSelection}
          onEditBoard={onEditBoard}
          onDeleteBoard={onDeleteBoard}
          onDuplicateBoard={onDuplicateBoard}
        />
      )}
    </div>
  );
}
