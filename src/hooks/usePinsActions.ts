import { usePins } from '@/contexts/PinsContext';
import { useBoards } from '@/contexts/BoardsContext';
import { fetchPins, searchPins, getRandomPins } from '@/lib/unsplash';
import { Pin, ReportedPin } from '@/types';
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

  const reportPin = (pinId: string, reason: string, description?: string) => {
    try {
      // اضافه کردن pin به لیست reported pins
      dispatch({ type: 'REPORT_PIN', payload: pinId });
      
      // ذخیره جزئیات گزارش در localStorage
      const reports = JSON.parse(localStorage.getItem('pinReports') || '[]');
      const newReport: ReportedPin = {
        id: Date.now().toString(),
        pinId,
        reason,
        description,
        reportedAt: new Date().toISOString(),
        userId: 'current-user', // در صورت وجود سیستم احراز هویت، از user ID واقعی استفاده کنید
      };
      
      const updatedReports = [...reports, newReport];
      localStorage.setItem('pinReports', JSON.stringify(updatedReports));
      
      console.log('Pin reported successfully:', { pinId, reason, description });
      
      return true;
    } catch (error) {
      console.error('Error reporting pin:', error);
      throw new Error('Failed to report pin');
    }
  };

  const hidePin = (pinId: string, reason?: string, feedback?: string) => {
    try {
      dispatch({ type: 'HIDE_PIN', payload: pinId });
      
      // ذخیره جزئیات مخفی کردن در localStorage
      if (reason || feedback) {
        const hiddenPinDetails = JSON.parse(localStorage.getItem('hiddenPinDetails') || '[]');
        const newHiddenDetail = {
          id: Date.now().toString(),
          pinId,
          reason,
          feedback,
          hiddenAt: new Date().toISOString(),
          userId: 'current-user', // در صورت وجود سیستم احراز هویت، از user ID واقعی استفاده کنید
        };
        
        const updatedHiddenDetails = [...hiddenPinDetails, newHiddenDetail];
        localStorage.setItem('hiddenPinDetails', JSON.stringify(updatedHiddenDetails));
      }
      
      console.log('Pin hidden successfully:', { pinId, reason, feedback });
      return true;
    } catch (error) {
      console.error('Error hiding pin:', error);
      throw new Error('Failed to hide pin');
    }
  };

  const getHiddenPinDetails = (pinId: string) => {
    try {
      const hiddenDetails = JSON.parse(localStorage.getItem('hiddenPinDetails') || '[]');
      return hiddenDetails.filter((detail: any) => detail.pinId === pinId);
    } catch (error) {
      console.error('Error getting hidden pin details:', error);
      return [];
    }
  };

  const unhidePin = (pinId: string) => {
    try {
      // حذف از state
      const updatedHiddenPins = state.hiddenPins.filter(id => id !== pinId);
      dispatch({ type: 'SET_HIDDEN_PINS', payload: updatedHiddenPins });
      
      // حذف از localStorage
      localStorage.setItem('hiddenPins', JSON.stringify(updatedHiddenPins));
      
      // حذف جزئیات مخفی کردن
      const hiddenDetails = JSON.parse(localStorage.getItem('hiddenPinDetails') || '[]');
      const updatedHiddenDetails = hiddenDetails.filter((detail: any) => detail.pinId !== pinId);
      localStorage.setItem('hiddenPinDetails', JSON.stringify(updatedHiddenDetails));
      
      console.log('Pin unhidden successfully:', pinId);
      return true;
    } catch (error) {
      console.error('Error unhiding pin:', error);
      throw new Error('Failed to unhide pin');
    }
  };


  const isPinReported = (pinId: string): boolean => {
    return state.reportedPins.includes(pinId);
  };

  // Helper function برای چک کردن اینکه آیا pin مخفی شده یا نه
  const isPinHidden = (pinId: string): boolean => {
    return state.hiddenPins.includes(pinId);
  };

  // Function برای گرفتن تمام گزارش‌های یک pin
  const getPinReports = (pinId: string): ReportedPin[] => {
    try {
      const reports = JSON.parse(localStorage.getItem('pinReports') || '[]');
      return reports.filter((report: ReportedPin) => report.pinId === pinId);
    } catch (error) {
      console.error('Error getting pin reports:', error);
      return [];
    }
  };

  // Function برای فیلتر کردن pins مخفی شده از نتایج
  const getVisiblePins = (): Pin[] => {
    return state.pins.filter(pin => !state.hiddenPins.includes(pin.id));
  };

  const loadPins = async (page = 1, reset = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const newPins = await fetchPins(page, 30);
      
      if (reset) {
        dispatch({ type: 'SET_PINS', payload: newPins });
      } else {
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

  const getPinById = useCallback((pinId: string): Pin | null => {
    const currentPin = state.pins.find(pin => pin.id === pinId);
    if (currentPin) {
      return currentPin;
    }

    const savedPins = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const savedPin = savedPins.find((pin: Pin) => pin.id === pinId);
    if (savedPin) {
      return savedPin;
    }

    return null;
  }, [state.pins]);

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

  const undoReportPin = (pinId: string) => {
    try {
      // حذف از reported pins
      const updatedReportedPins = state.reportedPins.filter(id => id !== pinId);
      dispatch({ type: 'SET_REPORTED_PINS', payload: updatedReportedPins });
      localStorage.setItem('reportedPins', JSON.stringify(updatedReportedPins));
      
      // حذف از pin reports
      const reports = JSON.parse(localStorage.getItem('pinReports') || '[]');
      const updatedReports = reports.filter((report: ReportedPin) => report.pinId !== pinId);
      localStorage.setItem('pinReports', JSON.stringify(updatedReports));
      
      console.log('Pin report undone successfully:', pinId);
      return true;
    } catch (error) {
      console.error('Error undoing pin report:', error);
      throw new Error('Failed to undo pin report');
    }
  };
  
  // اضافه کردن function برای گرفتن دلیل hide/report
  const getHideReason = (pinId: string): string | undefined => {
    try {
      const hiddenDetails = JSON.parse(localStorage.getItem('hiddenPinDetails') || '[]');
      const detail = hiddenDetails.find((d: any) => d.pinId === pinId);
      return detail?.reason;
    } catch (error) {
      return undefined;
    }
  };
  
  const getReportReason = (pinId: string): string | undefined => {
    try {
      const reports = JSON.parse(localStorage.getItem('pinReports') || '[]');
      const report = reports.find((r: ReportedPin) => r.pinId === pinId);
      return report?.reason;
    } catch (error) {
      return undefined;
    }
  };

  return {
    loadPins,
    searchForPins,
    loadRandomPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    reportPin,
    isPinReported,
    isPinHidden,
    getPinReports, 
    getVisiblePins, 
    savePinToBoard,
    likeComment,
    addComment,
    addReply,
    getComments,
    getPinById,
    clearPins,
    hidePin,
    unhidePin,
    getHiddenPinDetails,
    undoReportPin,
    getHideReason,
    getReportReason,
    ...state,
  };
}
