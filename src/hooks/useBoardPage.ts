'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useBoards, useBoardsActions } from '@/contexts/BoardsContext';
import { Board, Pin } from '@/types';
import {
  BoardPageState,
  EditBoardState,
  SortOption,
} from '@/types/boardPage.types';

export function useBoardPage(boardId: string) {
  const router = useRouter();
  const { state } = useBoards();
  const { deleteBoard, updateBoard } = useBoardsActions();

  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize board data
  useEffect(() => {
    if (state.initialized) {
      const foundBoard = state.boards.find(b => b.id === boardId);
      setBoard(foundBoard || null);
      setIsLoading(false);
    }
  }, [boardId, state.boards, state.initialized]);

  const handleDeleteBoard = () => {
    if (!board) return;

    toast(`Delete "${board.title}"?`, {
      description:
        'This action cannot be undone. All pins in this board will be removed.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteBoard(boardId);
          toast.success('Board deleted successfully');
          router.push('/boards');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleShare = async () => {
    if (!board) return;

    const shareData = {
      title: board.title,
      text: board.description || `Check out my ${board.title} board`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share board');
    }
  };

  const handleExportBoard = () => {
    if (!board) return;

    const exportData = {
      board: {
        title: board.title,
        description: board.description,
        createdAt: board.createdAt,
        pins: board.pins.map(pin => ({
          title: pin.title,
          description: pin.description,
          imageUrl: pin.imageUrl,
          tags: pin.tags,
          createdAt: pin.createdAt,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${board.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_board.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Board exported successfully');
  };

  return {
    board,
    isLoading,
    setBoard,
    handleDeleteBoard,
    handleShare,
    handleExportBoard,
    updateBoard,
    router,
  };
}
