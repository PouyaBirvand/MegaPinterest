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
  Globe,
  Plus,
  Copy,
  ShareIcon,
} from 'lucide-react';
import { Board } from '@/types';

interface BoardsGridProps {
  boards: Board[];
  selectedBoards: string[];
  onToggleSelection: (boardId: string) => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (boardId: string, boardTitle: string) => void;
  onDuplicateBoard: (board: Board) => void;
}

export function BoardsGrid({
  boards,
  selectedBoards,
  onToggleSelection,
  onEditBoard,
  onDeleteBoard,
  onDuplicateBoard,
}: BoardsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {boards.map(board => (
        <BoardGridItem
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

interface BoardGridItemProps {
  board: Board;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function BoardGridItem({
  board,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onDuplicate,
}: BoardGridItemProps) {
  return (
    <div className="group relative">
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="w-4 h-4 rounded border-2 border-white bg-white/90 backdrop-blur-sm"
        />
      </div>

      {/* Board Card */}
      <Link href={`/boards/${board.id}`} className="block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group-hover:shadow-lg transition-all duration-200">
          {board.pins.length > 0 ? (
            <BoardThumbnail pins={board.pins} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
              <Plus className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Privacy indicator */}
          <div className="absolute top-3 right-3">
            {board.isPrivate ? (
              <div className="bg-black/70 text-white p-1.5 rounded-full">
                <Lock className="h-3 w-3" />
              </div>
            ) : (
              <div className="bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Globe className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Board Info */}
      <div className="mt-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/boards/${board.id}`}>
              <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                {board.title}
              </h3>
            </Link>
            {board.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {board.description}
              </p>
            )}
          </div>

          {/* Board Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
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

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <span>
              {board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}
            </span>
            {board.isPrivate && (
              <>
                <span>•</span>
                <Lock className="h-3 w-3" />
              </>
            )}
          </span>
          <span>{new Date(board.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// Board thumbnail component
function BoardThumbnail({ pins }: { pins: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-1 h-full">
      {pins.slice(0, 4).map((pin, index) => (
        <div
          key={pin.id}
          className={`relative overflow-hidden ${
            pins.length === 1
              ? 'col-span-2'
              : pins.length === 3 && index === 0
                ? 'col-span-2'
                : ''
          }`}
        >
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            height={50}
            width={50}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {pins.length > 4 && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          +{pins.length - 4}
        </div>
      )}
    </div>
  );
}
