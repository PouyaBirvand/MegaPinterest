'use client';

import React, { useState } from 'react';
import { Plus, Check, Lock, Globe } from 'lucide-react';
import { Pin, Board } from '@/types';

// Import UI components
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import hooks and contexts
import { useBoards } from '@/contexts/BoardsContext';
import { usePinsActions } from '@/hooks/usePinsActions';

interface SaveToBoardDialogProps {
  pin: Pin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SaveToBoardDialog({ pin, open, onOpenChange }: SaveToBoardDialogProps) {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const { state: boardsState, dispatch: boardsDispatch } = useBoards();
  const { savePinToBoard } = usePinsActions();

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;

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
    localStorage.setItem('boards', JSON.stringify([...existingBoards, newBoard]));

    // Reset form
    setNewBoardTitle('');
    setNewBoardDescription('');
    setIsPrivate(false);
    setShowCreateBoard(false);
    
    // Save pin to new board and close dialog
    savePinToBoard(pin, newBoard.id);
    onOpenChange(false);
  };

  const handleSaveToBoard = (boardId: string) => {
    savePinToBoard(pin, boardId);
    onOpenChange(false);
  };

  const isPinInBoard = (board: Board) => {
    return board.pins.some(p => p.id === pin.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save Pin</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Pin Preview */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{pin.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                by {pin.author.name}
              </p>
            </div>
          </div>

          {/* Create New Board Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowCreateBoard(!showCreateBoard)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create board
          </Button>

          {/* Create Board Form */}
          {showCreateBoard && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor="board-title">Board name</Label>
                <Input
                  id="board-title"
                  placeholder="Like Places to go or Recipes to try"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="board-description">Description (optional)</Label>
                <Input
                  id="board-description"
                  placeholder="What's your board about?"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private-board"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private-board" className="flex items-center space-x-2">
                  {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  <span>{isPrivate ? 'Keep this board secret' : 'Visible to everyone'}</span>
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateBoard} disabled={!newBoardTitle.trim()}>
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCreateBoard(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Boards */}
          <div>
            <Label className="text-sm font-medium">Your boards</Label>
            <ScrollArea className="h-64 mt-2">
              <div className="space-y-2">
                {boardsState.boards.map((board) => (
                  <div
                    key={board.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
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
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{board.title}</p>
                          {board.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {board.pins.length} pins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isPinInBoard(board) && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      <Button
                        size="sm"
                        variant={isPinInBoard(board) ? "secondary" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToBoard(board.id);
                        }}
                        disabled={isPinInBoard(board)}
                      >
                        {isPinInBoard(board) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {boardsState.boards.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No boards yet</p>
                    <p className="text-sm">Create your first board to save pins</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SaveToBoardDialog;
