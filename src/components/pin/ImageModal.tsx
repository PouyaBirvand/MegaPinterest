'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useImageModal } from '@/hooks/useImageModal';
import type { ImageModalProps } from '@/types/modal.types';

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImageModalProps) {
  const {
    transform,
    isDragging,
    dragStart,
    isFullscreen,
    resetTransform,
    zoomIn,
    zoomOut,
    rotate,
    toggleFullscreen,
    setTransform,
    setIsDragging,
    setDragStart,
  } = useImageModal();

  useEffect(() => {
    if (isOpen) {
      resetTransform();
    }
  }, [isOpen, resetTransform]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetTransform();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          rotate();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    onClose,
    zoomIn,
    zoomOut,
    resetTransform,
    rotate,
    toggleFullscreen,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (transform.zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - transform.position.x,
        y: e.clientY - transform.position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && transform.zoom > 1) {
      setTransform(prev => ({
        ...prev,
        position: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setTransform(prev => ({
      ...prev,
      zoom: Math.max(0.25, Math.min(5, prev.zoom + delta)),
    }));
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title?.replace(/[^a-z0-9]/gi, '_') || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${isFullscreen ? 'max-w-full max-h-full w-screen h-screen' : 'max-w-7xl max-h-[95vh]'}
          p-0 bg-black/95 backdrop-blur-md border-0 overflow-hidden
        `}
        onPointerDownOutside={e => e.preventDefault()}
      >
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </Button>
              <h3 className="text-white font-medium truncate max-w-md">
                {title}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={transform.zoom <= 0.25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                {Math.round(transform.zoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={transform.zoom >= 5}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={rotate}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={downloadImage}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${transform.position.x}px, ${transform.position.y}px) scale(${transform.zoom}) rotate(${transform.rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={imageUrl}
              alt={title}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain select-none"
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>

        {/* Footer Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              onClick={resetTransform}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Reset View
            </Button>
            <div className="text-white text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Use mouse wheel to zoom • Drag to pan • Press R to rotate • Press
              F for fullscreen
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
