'use client';

import { EyeOff, Flag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface PinActionsDropdownProps {
  isHidden: boolean;
  isReported: boolean;
  onHide: () => void;
  onReport: () => void;
  onUnhide: () => void;
  onUndoReport: () => void;
}

export function PinActionsDropdown({
  isHidden,
  isReported,
  onHide,
  onReport,
  onUnhide,
  onUndoReport,
}: PinActionsDropdownProps) {
  return (
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
          <DropdownMenuItem onClick={onHide}>
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
            onClick={onReport}
            className="text-red-600 focus:text-red-600"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Pin
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
