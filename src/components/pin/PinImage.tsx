'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import PinOverlay from '../PinOverlay';

interface PinImageProps {
  imageUrl: string;
  title: string;
  isHidden: boolean;
  isReported: boolean;
  onImageClick: () => void;
  onUnhide: () => void;
  onUndoReport: () => void;
}

export function PinImage({
  imageUrl,
  title,
  isHidden,
  isReported,
  onImageClick,
  onUnhide,
  onUndoReport,
}: PinImageProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="sticky top-24">
      <PinOverlay
        isHidden={isHidden}
        isReported={isReported}
        onUnhide={onUnhide}
        onUndoReport={onUndoReport}
        className="w-full"
      >
        <div className="relative bg-gradient-to-br bg-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl group">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
          )}

          <div
            className="relative aspect-auto min-h-[400px] lg:min-h-[800px] flex items-center justify-center cursor-pointer"
            onClick={onImageClick}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={`
                object-contain transition-all !rounded-2xl duration-700 ease-out p-4
                group-hover:scale-105
                ${
                  isImageLoading
                    ? 'blur-lg scale-110 opacity-0'
                    : 'blur-0 scale-100 opacity-100'
                }
              `}
              priority
              onLoad={() => {
                setTimeout(() => setIsImageLoading(false), 150);
              }}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <ZoomIn className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to view full size
          </div>
        </div>
      </PinOverlay>
    </div>
  );
}
