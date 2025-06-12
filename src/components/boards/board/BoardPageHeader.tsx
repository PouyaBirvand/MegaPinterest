'use client';

import { BoardHeader } from './BoardHeader';
import { BoardInfo } from './BoardInfo';
import { BoardActionsMenu } from './BoardActionsMenu';
import { Board } from '@/types';

interface BoardPageHeaderProps {
  board: Board;
  onBack: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function BoardPageHeader({
  board,
  onBack,
  onShare,
  onEdit,
  onDelete,
  onExport,
}: BoardPageHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <BoardHeader
          onBack={onBack}
          onShare={onShare}
          onOpenMenu={() => {}} // Will be handled by BoardActionsMenu
        />
        <BoardInfo board={board} />
        <BoardActionsMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onExport={onExport}
        />
      </div>
    </div>
  );
}
