import { useEffect } from 'react';
import { usePins } from '@/contexts/PinsContext';
import { useBoards } from '@/contexts/BoardsContext';

export function useLocalStorage() {
  const { dispatch: pinsDispatch } = usePins();
  const { dispatch: boardsDispatch } = useBoards();

  useEffect(() => {
    // Load saved pins from localStorage
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    savedPins.forEach((pin: any) => {
      pinsDispatch({ type: 'SAVE_PIN', payload: pin });
    });

    // Load liked pins from localStorage
    const likedPins = JSON.parse(localStorage.getItem('likedPins') || '[]');
    likedPins.forEach((pinId: string) => {
      pinsDispatch({ type: 'LIKE_PIN', payload: pinId });
    });

    // Load boards from localStorage
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    if (boards.length > 0) {
      boardsDispatch({ type: 'SET_BOARDS', payload: boards });
    } else {
      // Create default board
      const defaultBoard = {
        id: 'default',
        title: 'My Pins',
        description: 'My saved pins',
        pins: [],
        isPrivate: false,
        createdAt: new Date().toISOString(),
      };
      boardsDispatch({ type: 'ADD_BOARD', payload: defaultBoard });
      localStorage.setItem('boards', JSON.stringify([defaultBoard]));
    }
  }, [pinsDispatch, boardsDispatch]);
}
