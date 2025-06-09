'use client';

import { EyeOff, Flag, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinOverlayProps {
  isHidden?: boolean;
  isReported?: boolean;
  onUnhide?: () => void;
  onUndoReport?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function PinOverlay({
  isHidden = false,
  isReported = false,
  onUnhide,
  onUndoReport,
  className,
  children
}: PinOverlayProps) {

  return (
    <div className={cn("relative group", className)}>
      {children}
      
      {/* Simple Hidden Overlay */}
      {isHidden && (
        <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Hidden</span>
            
            {onUnhide && (
              <button
                onClick={onUnhide}
                className="block mt-2 mx-auto text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Simple Reported Overlay */}
      {isReported && !isHidden && (
        <div className="absolute inset-0 bg-red-50/90 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Flag className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <span className="text-sm text-red-500">Reported</span>
            
            {onUndoReport && (
              <button
                onClick={onUndoReport}
                className="block mt-2 mx-auto text-xs text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
