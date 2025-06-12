'use client';

import { EyeOff, Flag } from 'lucide-react';

interface PinStatusBannerProps {
  isHidden: boolean;
  isReported: boolean;
  hideReason?: string;
  reportReason?: string;
}

export function PinStatusBanner({
  isHidden,
  isReported,
  hideReason,
  reportReason,
}: PinStatusBannerProps) {
  if (!isHidden && !isReported) return null;

  return (
    <div className="p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-800/50">
      {isHidden && (
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <EyeOff className="h-4 w-4" />
          <span className="text-sm">This pin is hidden</span>
          {hideReason && <span className="text-xs">• {hideReason}</span>}
        </div>
      )}
      {isReported && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <Flag className="h-4 w-4" />
          <span className="text-sm">This pin has been reported</span>
          {reportReason && <span className="text-xs">• {reportReason}</span>}
        </div>
      )}
    </div>
  );
}
