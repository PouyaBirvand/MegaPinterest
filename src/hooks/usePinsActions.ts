import { usePins } from '@/contexts/PinsContext';
import { useBoards } from '@/contexts/BoardsContext';
import { fetchPins, searchPins, getRandomPins } from '@/lib/unsplash';
import { Pin } from '@/types';
import { useCallback } from 'react';

interface Comment {
  id: string;
  user: { id: string; name: string; avatar: string };
  text: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

function mergePinsWithoutDuplicates(existingPins: Pin[], newPins: Pin[]): Pin[] {
  const existingIds = new Set(existingPins.map(pin => pin.id));
  const uniqueNewPins = newPins.filter(pin => !existingIds.has(pin.id));
  return [...existingPins, ...uniqueNewPins];
}

export function usePinsActions() {
  const { state, dispatch } = usePins();
  const { dispatch: boardsDispatch } = useBoards();
  const loadPins = async (page = 1, reset = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const newPins = await fetchPins(page, 30);
      
      if (reset) {
        dispatch({ type: 'SET_PINS', payload: newPins });
      } else {
        // ترکیب بدون تکرار
        const mergedPins = mergePinsWithoutDuplicates(state.pins, newPins);
        dispatch({ type: 'SET_PINS', payload: mergedPins });
      }
      
      dispatch({ type: 'SET_HAS_MORE', payload: newPins.length === 30 });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadRandomPins = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // پاک کردن pins قبلی
      dispatch({ type: 'SET_PINS', payload: [] });
            
      const randomPins = await getRandomPins(30);
      dispatch({ type: 'SET_PINS', payload: randomPins });
      dispatch({ type: 'SET_HAS_MORE', payload: randomPins.length === 30 });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load random pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const searchForPins = async (query: string, page = 1, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
            
      // اگر صفحه اول است، pins قبلی را پاک کن
      if (page === 1) {
        dispatch({ type: 'SET_PINS', payload: [] });
      }
            
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
        // ترکیب بدون تکرار برای pagination
        const mergedPins = mergePinsWithoutDuplicates(state.pins, pins);
        dispatch({ type: 'SET_PINS', payload: mergedPins });
      }
      
      dispatch({ type: 'SET_HAS_MORE', payload: page < totalPages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search pins' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // اضافه کردن متد clearPins
  const clearPins = () => {
    dispatch({ type: 'SET_PINS', payload: [] });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_HAS_MORE', payload: true });
  };
  

  const savePin = (pin: Pin) => {
    dispatch({ type: 'SAVE_PIN', payload: pin });
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const updatedSavedPins = [...savedPins, pin];
    localStorage.setItem('savedPins', JSON.stringify(updatedSavedPins));
  };

  const unsavePin = (pinId: string) => {
    dispatch({ type: 'UNSAVE_PIN', payload: pinId });
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const updatedSavedPins = savedPins.filter((pin: Pin) => pin.id !== pinId);
    localStorage.setItem('savedPins', JSON.stringify(updatedSavedPins));
  };

  const likePin = (pinId: string) => {
    dispatch({ type: 'LIKE_PIN', payload: pinId });
    const likedPins = JSON.parse(localStorage.getItem('likedPins') || '[]');
    if (!likedPins.includes(pinId)) {
      likedPins.push(pinId);
      localStorage.setItem('likedPins', JSON.stringify(likedPins));
    }
  };

  const unlikePin = (pinId: string) => {
    dispatch({ type: 'UNLIKE_PIN', payload: pinId });
    const likedPins = JSON.parse(localStorage.getItem('likedPins') || '[]');
    const updatedLikedPins = likedPins.filter((id: string) => id !== pinId);
    localStorage.setItem('likedPins', JSON.stringify(updatedLikedPins));
  };

  const savePinToBoard = (pin: Pin, boardId: string) => {
    boardsDispatch({ type: 'ADD_PIN_TO_BOARD', payload: { boardId, pin } });
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    const updatedBoards = boards.map((board: any) =>
      board.id === boardId ? { ...board, pins: [...board.pins, pin] } : board
    );
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  // اضافه کردن متد getPinById
  const getPinById = useCallback((pinId: string): Pin | null => {
    // ابتدا از pins موجود در state جستجو می‌کنیم
    const currentPin = state.pins.find(pin => pin.id === pinId);
    if (currentPin) {
      return currentPin;
    }

    // اگر پیدا نشد، از savedPins جستجو می‌کنیم
    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const savedPin = savedPins.find((pin: Pin) => pin.id === pinId);
    if (savedPin) {
      return savedPin;
    }

    // اگر هنوز پیدا نشد، null برمی‌گردانیم
    return null;
  }, [state.pins]);

  // Comment actions
  const likeComment = (pinId: string, commentId: string) => {
    const comments = JSON.parse(
      localStorage.getItem(`comments_${pinId}`) || '[]'
    );
    const updatedComments = comments.map((comment: Comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      // برای replies هم چک می‌کنیم
      if (comment.replies) {
        const updatedReplies = comment.replies.map((reply: Comment) => {
          if (reply.id === commentId) {
            return {
              ...reply,
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    localStorage.setItem(`comments_${pinId}`, JSON.stringify(updatedComments));
    return updatedComments;
  };

  const addComment = (
    pinId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>
  ) => {
    const comments = JSON.parse(
      localStorage.getItem(`comments_${pinId}`) || '[]'
    );
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    };
    const updatedComments = [newComment, ...comments];
    localStorage.setItem(`comments_${pinId}`, JSON.stringify(updatedComments));
    return updatedComments;
  };

  const addReply = (
    pinId: string,
    commentId: string,
    reply: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>
  ) => {
    const comments = JSON.parse(
      localStorage.getItem(`comments_${pinId}`) || '[]'
    );
    const newReply: Comment = {
      ...reply,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    const updatedComments = comments.map((comment: Comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    });

    localStorage.setItem(`comments_${pinId}`, JSON.stringify(updatedComments));
    return updatedComments;
  };

  const getComments = useCallback((pinId: string): Comment[] => {
    return JSON.parse(localStorage.getItem(`comments_${pinId}`) || '[]');
  }, []);

  return {
    loadPins,
    searchForPins,
    loadRandomPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    savePinToBoard,
    likeComment,
    addComment,
    addReply,
    getComments,
    getPinById,
    clearPins,
    ...state,
  };
}
