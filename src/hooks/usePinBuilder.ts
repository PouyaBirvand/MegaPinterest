'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useBoards } from '@/contexts/BoardsContext';
import { usePinsActions } from '@/hooks/usePinsActions';
import { Pin } from '@/types';
import { PinFormData, ImageData } from '@/types/pin-builder.types';

export function usePinBuilder() {
  const router = useRouter();
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state: boardsState } = useBoards();
  const { savePinToBoard } = usePinsActions();

  const createPinObject = useCallback(
    (formData: PinFormData, imageData: ImageData): Pin => {
      return {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: imageData.preview,
        imageWidth: 400,
        imageHeight: 600,
        author: {
          id: 'user-1',
          name: 'You',
          username: 'you',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: formData.tags,
        link: formData.link.trim(),
        altText: formData.altText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        saves: 0,
      };
    },
    []
  );

  const savePin = useCallback(
    async (formData: PinFormData, imageData: ImageData) => {
      if (!imageData.preview || !formData.title.trim()) {
        toast.error('Please add an image and title');
        return;
      }

      setIsLoading(true);

      try {
        const newPin = createPinObject(formData, imageData);
        const boardId = selectedBoardId || boardsState.boards[0]?.id;

        if (!boardId) {
          toast.error('No board available. Please create a board first.');
          return;
        }

        savePinToBoard(newPin, boardId);
        toast.success('Pin saved successfully!');
        router.push('/boards');
      } catch (error) {
        console.error('Failed to save pin:', error);
        toast.error('Failed to save pin. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedBoardId,
      boardsState.boards,
      savePinToBoard,
      router,
      createPinObject,
    ]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return {
    selectedBoardId,
    setSelectedBoardId,
    isLoading,
    boards: boardsState.boards,
    savePin,
    handleCancel,
  };
}
