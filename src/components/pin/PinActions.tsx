'use client';

import { useState } from 'react';
import {
  Heart,
  Download,
  Share,
  MoreHorizontal,
  EyeOff,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import HidePinDialog from '@/components/HidePinDialog';
import ReportPinDialog from '@/components/ReportPinDialog';
import { Pin } from '@/types';

interface PinActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  savesCount: number;
  isHidden: boolean;
  isReported: boolean;
  hideReason?: string | null;
  reportReason?: string | null;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onHide: (reason: string) => void;
  onReport: (reason: string, description?: string) => void;
  onUnhide: () => void;
  onUndoReport: () => void;
  pin: Pin;
}

export function PinActions({
  isLiked,
  isSaved,
  isHidden,
  isReported,
  onLike,
  onSave,
  onShare,
  onDownload,
  onHide,
  onReport,
  onUnhide,
  onUndoReport,
  pin,
}: PinActionsProps) {
  const [showHideDialog, setShowHideDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleHidePin = (reason: string) => {
    onHide(reason);
    setShowHideDialog(false);
  };

  const handleReportPin = (reason: string, description?: string) => {
    onReport(reason, description);
    setShowReportDialog(false);
  };

  return (
    <>
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

        {/* More Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isHidden ? (
              <DropdownMenuItem onClick={onUnhide}>
                <EyeOff className="h-4 w-4 mr-2" />
                Unhide Pin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setShowHideDialog(true)}>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Pin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isReported ? (
              <DropdownMenuItem onClick={onUndoReport}>
                <Flag className="h-4 w-4 mr-2" />
                Undo Report
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => setShowReportDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Pin
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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

      <HidePinDialog
        open={showHideDialog}
        onOpenChange={setShowHideDialog}
        onHide={handleHidePin}
        pin={pin}
      />

      <ReportPinDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onReport={handleReportPin}
        pin={pin}
      />
    </>
  );
}
