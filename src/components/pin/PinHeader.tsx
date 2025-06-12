'use client';

import { ArrowLeft, Heart, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PinActionsDropdown } from './PinActionsDropdown';

interface PinHeaderProps {
  isLiked: boolean;
  isSaved: boolean;
  isHidden: boolean;
  isReported: boolean;
  onBack: () => void;
  onLike: () => void;
  onDownload: () => void;
  onShare: () => void;
  onSave: () => void;
  onHide: () => void;
  onReport: () => void;
  onUnhide: () => void;
  onUndoReport: () => void;
}

export function PinHeader({
  isLiked,
  isSaved,
  isHidden,
  isReported,
  onBack,
  onLike,
  onDownload,
  onShare,
  onSave,
  onHide,
  onReport,
  onUnhide,
  onUndoReport,
}: PinHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onLike}
              className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onDownload}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Download className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onShare}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Share className="h-5 w-5" />
            </Button>

            <PinActionsDropdown
              isHidden={isHidden}
              isReported={isReported}
              onHide={onHide}
              onReport={onReport}
              onUnhide={onUnhide}
              onUndoReport={onUndoReport}
            />

            <Button
              onClick={onSave}
              variant={isSaved ? 'default' : 'outline'}
              className={`${
                isSaved
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
