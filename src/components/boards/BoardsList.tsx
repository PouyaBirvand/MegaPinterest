'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Plus,
  Copy,
  ShareIcon,
  Calendar,
} from 'lucide-react';
import { Board } from '@/types';

interface BoardsListProps {
  boards: Board[];
  selectedBoards: string[];
  onToggleSelection: (boardId: string) => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (boardId: string, boardTitle: string) => void;
  onDuplicateBoard: (board: Board) => void;
}

export function BoardsList({
  boards,
  selectedBoards,
  onToggleSelection,
  onEditBoard,
  onDeleteBoard,
  onDuplicateBoard,
}: BoardsListProps) {
  return (
    <div className="space-y-2">
      {boards.map(board => (
        <BoardListItem
          key={board.id}
          board={board}
          isSelected={selectedBoards.includes(board.id)}
          onToggleSelection={() => onToggleSelection(board.id)}
          onEdit={() => onEditBoard(board)}
          onDelete={() => onDeleteBoard(board.id, board.title)}
          onDuplicate={() => onDuplicateBoard(board)}
        />
      ))}
    </div>
  );
}

interface BoardListItemProps {
  board: Board;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function BoardListItem({
  board,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onDuplicate,
}: BoardListItemProps) {
  return (
    <div className="group flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      {/* Selection Checkbox */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="w-4 h-4 rounded"
        />
      </div>

      {/* Board Thumbnail */}
      <Link href={`/boards/${board.id}`} className="flex-shrink-0">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
          {board.pins.length > 0 ? (
            <Image
              src={board.pins[0].imageUrl}
              alt={board.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Plus className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>

      {/* Board Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/boards/${board.id}`}>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm hover:text-primary transition-colors">
              {board.title}
            </h3>
            {board.isPrivate && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </Link>

        {board.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {board.description}
          </p>
        )}

        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          <span>
            {board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(board.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      {/* Board Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Board actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit board
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
