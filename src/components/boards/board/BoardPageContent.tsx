'use client';

import { useBoardPage } from '@/hooks/useBoardPage';
import { useBoardFilters } from '@/hooks/useBoardFilters';
import { useBoardEdit } from '@/hooks/useBoardEdit';

import { BoardPageHeader } from './BoardPageHeader';
import { BoardPageLoading } from './BoardPageLoading';
import { BoardNotFound } from './BoardNotFound';
import { BoardContent } from './BoardContent';
// import { BoardActionsMenu } from './board-actions-menu';
import { EditBoardDialog } from './EditBoardDialog';
import { BoardPageProps } from '@/types/boardPage.types';

export function BoardPageContent({ boardId }: BoardPageProps) {
  const {
    board,
    isLoading,
    setBoard,
    handleDeleteBoard,
    handleShare,
    handleExportBoard,
    updateBoard,
    router,
  } = useBoardPage(boardId);

  const {
    filters,
    filteredPins,
    allTags,
    updateFilters,
    clearAllFilters,
    hasActiveFilters,
  } = useBoardFilters(board?.pins || []);

  const {
    editState,
    openEditDialog,
    closeEditDialog,
    updateEditState,
    handleEditBoard,
  } = useBoardEdit(board, updatedBoard => {
    updateBoard(updatedBoard);
    setBoard(updatedBoard);
  });

  if (isLoading) {
    return <BoardPageLoading />;
  }

  if (!board) {
    return <BoardNotFound onBackClick={() => router.push('/boards')} />;
  }

  return (
    <div className="min-h-screen">
      <BoardPageHeader
        board={board}
        onBack={() => router.back()}
        onShare={handleShare}
        onEdit={openEditDialog}
        onDelete={handleDeleteBoard}
        onExport={handleExportBoard}
      />

      <BoardContent
        board={board}
        pins={filteredPins}
        filters={filters}
        allTags={allTags}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearAllFilters}
        onNavigate={router.push}
      />

      <EditBoardDialog
        isOpen={editState.showEditDialog}
        editState={editState}
        onClose={closeEditDialog}
        onUpdateState={updateEditState}
        onSave={handleEditBoard}
      />
    </div>
  );
}
