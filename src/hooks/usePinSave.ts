'use client';

import { useRouter } from 'next/navigation';
import { useBoards } from '@/contexts/BoardsContext';
import { usePinsActions } from '@/hooks/usePinsActions';
import { Pin } from '@/types';
import { PinFormData } from '@/types/pin-builder.types';

export function usePinSave() {
  const router = useRouter();
  const { state: boardsState } = useBoards();
  const { savePinToBoard } = usePinsActions();

  const savePin = async (
    formData: PinFormData,
    imagePreview: string,
    selectedBoardId: string
  ) => {
    if (!imagePreview || !formData.title.trim()) {
      throw new Error('Please add an image and title');
    }

    const newPin: Pin = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: imagePreview,
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

    const boardId = selectedBoardId || boardsState.boards[0]?.id;
    if (boardId) {
      savePinToBoard(newPin, boardId);
    }

    router.push('/boards');
  };

  return { savePin };
}
