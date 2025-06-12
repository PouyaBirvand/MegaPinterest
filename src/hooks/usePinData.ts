'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPinById } from '@/lib/unsplash';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useAuth } from '@/contexts/AuthContext';
import { Pin } from '@/types';
import { Comment } from '@/types/comment.types';

interface UsePinDataReturn {
  pin: Pin | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  // Pin status
  isLiked: boolean;
  isSaved: boolean;
  isHidden: boolean;
  isReported: boolean;
  hideReason: string | null;
  reportReason: string | null;
  // Actions
  handleLike: () => void;
  handleSave: () => void;
  handleShare: () => void;
  handleHide: (reason: string) => void;
  handleReport: (reason: string, description?: string) => void;
  handleUnhide: () => void;
  handleUndoReport: () => void;
  handleDownload: () => void;
  // Comment actions
  handleAddComment: (text: string) => void;
  handleAddReply: (commentId: string, text: string) => void;
  handleLikeComment: (commentId: string) => void;
}

export function usePinData(pinId: string): UsePinDataReturn {
  const router = useRouter();
  const { user } = useAuth();
  const [pin, setPin] = useState<Pin | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    savedPins,
    likedPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    likeComment,
    addComment,
    addReply,
    getComments,
    getPinById,
    hidePin,
    reportPin,
    isPinHidden,
    isPinReported,
    unhidePin,
    undoReportPin,
    getHideReason,
    getReportReason,
  } = usePinsActions();

  const loadPin = useCallback(async () => {
    if (!pinId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Try local cache first
      let foundPin = getPinById(pinId);

      if (foundPin) {
        setPin(foundPin);
        setComments(getComments(pinId));
        setIsLoading(false);
        return;
      }

      // Fetch from API
      try {
        foundPin = await fetchPinById(pinId);

        if (foundPin) {
          setPin(foundPin);
          setComments(getComments(pinId));

          // Cache for future use
          const cachedPins = JSON.parse(
            localStorage.getItem('cachedPins') || '{}'
          );
          cachedPins[pinId] = foundPin;
          localStorage.setItem('cachedPins', JSON.stringify(cachedPins));
        } else {
          setError('Pin not found');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Failed to load pin');
      }
    } catch (error) {
      console.error('Load pin error:', error);
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [pinId, getPinById, getComments]);

  useEffect(() => {
    loadPin();
  }, [loadPin]);

  // Computed values
  const isSaved = pin ? savedPins.some(p => p.id === pin.id) : false;
  const isLiked = pin ? likedPins.includes(pin.id) : false;
  const isHidden = pin ? isPinHidden(pin.id) : false;
  const isReported = pin ? isPinReported(pin.id) : false;
  const hideReason = pin ? getHideReason(pin.id) : null;
  const reportReason = pin ? getReportReason(pin.id) : null;

  // Action handlers
  const handleSave = useCallback(() => {
    if (!pin || !user) {
      router.push('/auth/signin');
      return;
    }

    if (isSaved) {
      unsavePin(pin.id);
    } else {
      savePin(pin);
    }
  }, [pin, user, isSaved, savePin, unsavePin, router]);

  const handleLike = useCallback(() => {
    if (!pin || !user) {
      router.push('/auth/signin');
      return;
    }

    if (isLiked) {
      unlikePin(pin.id);
    } else {
      likePin(pin.id);
    }
  }, [pin, user, isLiked, likePin, unlikePin, router]);

  const handleShare = useCallback(() => {
    if (!pin) return;

    if (navigator.share) {
      navigator.share({
        title: pin.title,
        text: pin.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [pin]);

  const handleDownload = useCallback(async () => {
    if (!pin) return;

    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pin.title || 'pin'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [pin]);

  const handleHide = useCallback(
    (reason: string) => {
      if (!pin?.id) return;
      hidePin(pin.id, reason);
    },
    [pin, hidePin]
  );

  const handleReport = useCallback(
    (reason: string, description?: string) => {
      if (!pin?.id) return;
      reportPin(pin.id, reason, description);
    },
    [pin, reportPin]
  );

  const handleUnhide = useCallback(() => {
    if (!pin) return;
    unhidePin(pin.id);
  }, [pin, unhidePin]);

  const handleUndoReport = useCallback(() => {
    if (!pin) return;
    undoReportPin(pin.id);
  }, [pin, undoReportPin]);

  // Comment handlers - اصلاح شده
  const handleAddComment = useCallback(
    (text: string) => {
      if (!pin || !user) {
        router.push('/auth/signin');
        return;
      }

      const updatedComments = addComment(pin.id, {
        user: {
          id: user.id,
          name: user.name || 'Unknown User',
          avatar: user.image || '',
        },
        text,
      });

      setComments(updatedComments);
    },
    [pin, user, addComment, router]
  );

  const handleAddReply = useCallback(
    (commentId: string, text: string) => {
      if (!pin || !user) {
        router.push('/auth/signin');
        return;
      }

      const updatedComments = addReply(pin.id, commentId, {
        user: {
          id: user.id,
          name: user.name || 'Unknown User',
          avatar: user.image || '',
        },
        text,
      });

      setComments(updatedComments);
    },
    [pin, user, addReply, router]
  );

  const handleLikeComment = useCallback(
    (commentId: string) => {
      if (!pin || !user) {
        router.push('/auth/signin');
        return;
      }

      const updatedComments = likeComment(pin.id, commentId);
      setComments(updatedComments);
    },
    [pin, user, likeComment, router]
  );

  return {
    pin,
    comments,
    isLoading,
    error,
    refetch: loadPin,
    // Pin status
    isLiked,
    isSaved,
    isHidden,
    isReported,
    hideReason,
    reportReason,
    // Actions
    handleLike,
    handleSave,
    handleShare,
    handleHide,
    handleReport,
    handleUnhide,
    handleUndoReport,
    handleDownload,
    // Comment actions
    handleAddComment,
    handleAddReply,
    handleLikeComment,
  };
}
