'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Board } from '@/types';
import { EditBoardState } from '@/types/boardPage.types';

export function useBoardEdit(
  board: Board | null,
  onUpdate: (board: Board) => void
) {
  const [editState, setEditState] = useState<EditBoardState>({
    showEditDialog: false,
    editTitle: board?.title || '',
    editDescription: board?.description || '',
    editIsPrivate: board?.isPrivate || false,
    isUpdating: false,
  });

  const openEditDialog = () => {
    if (!board) return;

    setEditState({
      showEditDialog: true,
      editTitle: board.title,
      editDescription: board.description || '',
      editIsPrivate: board.isPrivate,
      isUpdating: false,
    });
  };

  const closeEditDialog = () => {
    setEditState(prev => ({ ...prev, showEditDialog: false }));
  };

  const updateEditState = (updates: Partial<EditBoardState>) => {
    setEditState(prev => ({ ...prev, ...updates }));
  };

  const handleEditBoard = async () => {
    if (!board || !editState.editTitle.trim() || editState.isUpdating) return;

    setEditState(prev => ({ ...prev, isUpdating: true }));

    try {
      const updatedBoard: Board = {
        ...board,
        title: editState.editTitle.trim(),
        description: editState.editDescription.trim(),
        isPrivate: editState.editIsPrivate,
      };

      onUpdate(updatedBoard);
      closeEditDialog();
      toast.success('Board updated successfully');
    } catch (error) {
      toast.error('Failed to update board');
    } finally {
      setEditState(prev => ({ ...prev, isUpdating: false }));
    }
  };

  return {
    editState,
    openEditDialog,
    closeEditDialog,
    updateEditState,
    handleEditBoard,
  };
}
