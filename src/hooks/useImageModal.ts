'use client';

import { useState, useCallback } from 'react';
import type { ImageTransform } from '@/types/modal.types';

export function useImageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1,
    rotation: 0,
    position: { x: 0, y: 0 },
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resetTransform = useCallback(() => {
    setTransform({
      zoom: 1,
      rotation: 0,
      position: { x: 0, y: 0 },
    });
    setIsFullscreen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
    resetTransform();
  }, [resetTransform]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.25, 5),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.25, 0.25),
    }));
  }, []);

  const rotate = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return {
    isOpen,
    transform,
    isDragging,
    dragStart,
    isFullscreen,
    openModal,
    closeModal,
    resetTransform,
    zoomIn,
    zoomOut,
    rotate,
    toggleFullscreen,
    setTransform,
    setIsDragging,
    setDragStart,
  };
}
