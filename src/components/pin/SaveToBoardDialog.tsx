'use client';
import React, { useState } from 'react';
import { Plus, Check, Lock, Globe, X } from 'lucide-react';
import { Pin, Board } from '@/types';

// Import UI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Import hooks and contexts
import { useBoards } from '@/contexts/BoardsContext';
import { usePinsActions } from '@/hooks/usePinsActions';
import Image from 'next/image';

interface SaveToBoardDialogProps {
  pin: Pin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveToBoardDialog({
  pin,
  open,
  onOpenChange,
}: SaveToBoardDialogProps) {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { state: boardsState, dispatch: boardsDispatch } = useBoards();
  const { savePinToBoard } = usePinsActions();

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim() || isCreating) return;

    setIsCreating(true);

    try {
      const newBoard: Board = {
        id: Date.now().toString(),
        title: newBoardTitle.trim(),
        description: newBoardDescription.trim(),
        pins: [],
        isPrivate,
        createdAt: new Date().toISOString(),
      };

      boardsDispatch({ type: 'ADD_BOARD', payload: newBoard });

      // Save to localStorage
      const existingBoards = JSON.parse(localStorage.getItem('boards') || '[]');
      localStorage.setItem(
        'boards',
        JSON.stringify([...existingBoards, newBoard])
      );

      // Reset form
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsPrivate(false);
      setShowCreateBoard(false);

      // Save pin to new board and close dialog
      savePinToBoard(pin, newBoard.id);
      onOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveToBoard = (boardId: string) => {
    savePinToBoard(pin, boardId);
    onOpenChange(false);
  };

  const isPinInBoard = (board: Board) => {
    return board.pins.some(p => p.id === pin.id);
  };

  const handleCancel = () => {
    setShowCreateBoard(false);
    setNewBoardTitle('');
    setNewBoardDescription('');
    setIsPrivate(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogTitle className="text-xl font-semibold">Save Pin</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          {/* Pin Preview */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border shadow-sm">
              <div className="relative">
                <Image
                  width={50}
                  height={50}
                  src={pin.imageUrl}
                  alt={pin.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-lg">
                  {pin.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  by {pin.author.name}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-4 space-y-6">
                {/* Create New Board Section */}
                <div className="space-y-4">
                  <Button
                    variant={showCreateBoard ? 'secondary' : 'outline'}
                    className="w-full justify-start h-12 text-left font-medium transition-all duration-200 hover:shadow-sm"
                    onClick={() => setShowCreateBoard(!showCreateBoard)}
                  >
                    {showCreateBoard ? (
                      <X className="h-5 w-5 mr-3" />
                    ) : (
                      <Plus className="h-5 w-5 mr-3" />
                    )}
                    {showCreateBoard ? 'Cancel' : 'Create new board'}
                  </Button>

                  {/* Create Board Form */}
                  {showCreateBoard && (
                    <div className="space-y-5 p-5 border rounded-xl bg-muted/20 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2">
                        <Label
                          htmlFor="board-title"
                          className="text-sm font-medium"
                        >
                          Board name *
                        </Label>
                        <Input
                          id="board-title"
                          placeholder="e.g., Travel Ideas, Recipe Collection..."
                          value={newBoardTitle}
                          onChange={e => setNewBoardTitle(e.target.value)}
                          className="h-11"
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                          {newBoardTitle.length}/50 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="board-description"
                          className="text-sm font-medium"
                        >
                          Description
                        </Label>
                        <Input
                          id="board-description"
                          placeholder="What's this board about?"
                          value={newBoardDescription}
                          onChange={e => setNewBoardDescription(e.target.value)}
                          className="h-11"
                          maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground">
                          {newBoardDescription.length}/100 characters
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                        <div className="flex items-center space-x-3">
                          {isPrivate ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Globe className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <Label
                              htmlFor="private-board"
                              className="font-medium cursor-pointer"
                            >
                              {isPrivate ? 'Private board' : 'Public board'}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {isPrivate
                                ? 'Only you can see this board'
                                : 'Anyone can see this board'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="private-board"
                          checked={isPrivate}
                          onCheckedChange={setIsPrivate}
                        />
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button
                          onClick={handleCreateBoard}
                          disabled={!newBoardTitle.trim() || isCreating}
                          className="flex-1 h-11"
                        >
                          {isCreating ? 'Creating...' : 'Create Board'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1 h-11"
                          disabled={isCreating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Existing Boards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Your boards
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {boardsState.boards.length} board
                      {boardsState.boards.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {boardsState.boards.map(board => (
                      <div
                        key={board.id}
                        className="group flex items-center justify-between p-4 rounded-xl border bg-background hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="relative w-14 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                            {board.pins.length > 0 ? (
                              <img
                                src={board.pins[0].imageUrl}
                                alt={board.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Plus className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold truncate text-foreground">
                                {board.title}
                              </h4>
                              {board.isPrivate && (
                                <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {board.pins.length} pin
                              {board.pins.length !== 1 ? 's' : ''}
                            </p>
                            {board.description && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {board.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          {isPinInBoard(board) && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                          <Button
                            size="sm"
                            variant={
                              isPinInBoard(board) ? 'secondary' : 'default'
                            }
                            onClick={e => {
                              e.stopPropagation();
                              handleSaveToBoard(board.id);
                            }}
                            disabled={isPinInBoard(board)}
                            className="h-9 px-4 font-medium"
                          >
                            {isPinInBoard(board) ? 'Saved' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {boardsState.boards.length === 0 && (
                      <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          No boards yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          Create your first board to start organizing your pins
                          into collections
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
