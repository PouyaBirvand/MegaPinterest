import { usePins } from '@/contexts/PinsContext';
import { useBoards } from '@/contexts/BoardsContext';
import { fetchPins, searchPins, getRandomPins } from '@/lib/unsplash';
import { Pin } from '@/types';

export function usePinsActions() {
  const { state, dispatch } = usePins();
  const { state: boardsState, dispatch: boardsDispatch } = useBoards();

  const loadPins = async (page = 1, reset = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const newPins = await fetchPins(page, 30);
      
      if (reset) {
        dispatch({ type: 'SET_PINS', payload: newPins });
      } else {
        dispatch({ type: 'ADD_PINS', payload: newPins });
      }

      dispatch({ type: 'SET_HAS_MORE', payload: newPins.length === 30 });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchForPins = async (query: string, page = 1, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { pins, totalPages } = await searchPins(
        query,
        page,
        30,
        filters.orientation,
        filters.color
      );

      if (page === 1) {
        dispatch({ type: 'SET_PINS', payload: pins });
      } else {
        dispatch({ type: 'ADD_PINS', payload: pins });
      }

      dispatch({ type: 'SET_HAS_MORE', payload: page < totalPages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadRandomPins = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const randomPins = await getRandomPins(30);
      dispatch({ type: 'SET_PINS', payload: randomPins });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load random pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const savePin = (pin: Pin) => {
    dispatch({ type: 'SAVE_PIN', payload: pin });
    // Save to localStorage
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const updatedSavedPins = [...savedPins, pin];
    localStorage.setItem('savedPins', JSON.stringify(updatedSavedPins));
  };

  const unsavePin = (pinId: string) => {
    dispatch({ type: 'UNSAVE_PIN', payload: pinId });
    // Remove from localStorage
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const updatedSavedPins = savedPins.filter((pin: Pin) => pin.id !== pinId);
    localStorage.setItem('savedPins', JSON.stringify(updatedSavedPins));
  };

  const likePin = (pinId: string) => {
    dispatch({ type: 'LIKE_PIN', payload: pinId });
    // Save to localStorage
    const likedPins = JSON.parse(localStorage.getItem('likedPins') || '[]');
    if (!likedPins.includes(pinId)) {
      likedPins.push(pinId);
      localStorage.setItem('likedPins', JSON.stringify(likedPins));
    }
  };

  const unlikePin = (pinId: string) => {
    dispatch({ type: 'UNLIKE_PIN', payload: pinId });
    // Remove from localStorage
    const likedPins = JSON.parse(localStorage.getItem('likedPins') || '[]');
    const updatedLikedPins = likedPins.filter((id: string) => id !== pinId);
    localStorage.setItem('likedPins', JSON.stringify(updatedLikedPins));
  };

  const savePinToBoard = (pin: Pin, boardId: string) => {
    boardsDispatch({ type: 'ADD_PIN_TO_BOARD', payload: { boardId, pin } });
    // Update localStorage
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    const updatedBoards = boards.map((board: any) =>
      board.id === boardId
        ? { ...board, pins: [...board.pins, pin] }
        : board
    );
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  return {
    loadPins,
    searchForPins,
    loadRandomPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    savePinToBoard,
    ...state,
  };
}
