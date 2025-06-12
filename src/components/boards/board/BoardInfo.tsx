'use client';

import { Lock, Globe } from 'lucide-react';
import { Board } from '@/types';

interface BoardInfoProps {
  board: Board;
}

export function BoardInfo({ board }: BoardInfoProps) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <h1 className="text-3xl font-bold">{board.title}</h1>
        {board.isPrivate ? (
          <Lock className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Globe className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      {board.description && (
        <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-lg">
          {board.description}
        </p>
      )}
      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
        <span>
          {board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}
        </span>
        <span>•</span>
        <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          {board.isPrivate ? (
            <>
              <Lock className="h-3 w-3" />
              <span>Private</span>
            </>
          ) : (
            <>
              <Globe className="h-3 w-3" />
              <span>Public</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
