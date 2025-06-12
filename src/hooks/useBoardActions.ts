'use client';

import { useCallback } from 'react';
import { Board } from '@/types';
import { useBoardsActions } from '@/contexts/BoardsContext';
import { toast } from 'sonner';

export function useBoardActions() {
  const { createBoard, deleteBoard, updateBoard } = useBoardsActions();

  const handleCreateBoard = useCallback(
    async (
      title: string,
      description: string,
      isPrivate: boolean,
      setLoading: (loading: boolean) => void,
      onSuccess: () => void
    ) => {
      if (!title.trim()) return;

      setLoading(true);
      try {
        createBoard({
          title: title.trim(),
          description: description.trim(),
          pins: [],
          isPrivate,
        });
        onSuccess();
        toast.success('Board created successfully!');
      } catch (error) {
        toast.error('Failed to create board');
      } finally {
        setLoading(false);
      }
    },
    [createBoard]
  );

  const handleUpdateBoard = useCallback(
    async (
      board: Board,
      title: string,
      description: string,
      isPrivate: boolean,
      setLoading: (loading: boolean) => void,
      onSuccess: () => void
    ) => {
      if (!title.trim()) return;

      setLoading(true);
      try {
        const updatedBoard: Board = {
          ...board,
          title: title.trim(),
          description: description.trim(),
          isPrivate,
        };
        updateBoard(updatedBoard);
        onSuccess();
        toast.success('Board updated successfully!');
      } catch (error) {
        toast.error('Failed to update board');
      } finally {
        setLoading(false);
      }
    },
    [updateBoard]
  );

  const handleDeleteBoard = useCallback(
    (boardId: string, boardTitle: string) => {
      toast(`Delete "${boardTitle}"?`, {
        description:
          'This action cannot be undone. All pins in this board will be removed.',
        action: {
          label: 'Delete',
          onClick: () => {
            deleteBoard(boardId);
            toast.success('Board deleted successfully');
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {},
        },
      });
    },
    [deleteBoard]
  );

  const handleDuplicateBoard = useCallback(
    (board: Board) => {
      createBoard({
        title: `${board.title} (Copy)`,
        description: board.description,
        pins: [...board.pins],
        isPrivate: board.isPrivate,
      });
      toast.success('Board duplicated successfully!');
    },
    [createBoard]
  );

  const handleBulkDelete = useCallback(
    (selectedBoards: string[], clearSelection: () => void) => {
      if (selectedBoards.length === 0) return;

      toast(
        `Delete ${selectedBoards.length} board${selectedBoards.length > 1 ? 's' : ''}?`,
        {
          description: 'This action cannot be undone.',
          action: {
            label: 'Delete All',
            onClick: () => {
              selectedBoards.forEach(boardId => deleteBoard(boardId));
              clearSelection();
              toast.success(
                `${selectedBoards.length} board${selectedBoards.length > 1 ? 's' : ''} deleted`
              );
            },
          },
          cancel: {
            label: 'Cancel',
            onClick: () => {},
          },
        }
      );
    },
    [deleteBoard]
  );

  return {
    handleCreateBoard,
    handleUpdateBoard,
    handleDeleteBoard,
    handleDuplicateBoard,
    handleBulkDelete,
  };
}
