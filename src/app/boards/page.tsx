'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Lock, Globe, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoards } from '@/contexts/BoardsContext';
import { Board } from '@/types';

export default function BoardsPage() {
  const { state, dispatch } = useBoards();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard: Board = {
      id: Date.now().toString(),
      title: newBoardTitle,
      description: newBoardDescription,
      pins: [],
      isPrivate,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_BOARD', payload: newBoard });
    
    // Save to localStorage
    const existingBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    localStorage.setItem('boards', JSON.stringify([...existingBoards, newBoard]));

    // Reset form
    setNewBoardTitle('');
    setNewBoardDescription('');
    setIsPrivate(false);
    setShowCreateDialog(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    dispatch({ type: 'DELETE_BOARD', payload: boardId });
    
    // Update localStorage
    const existingBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    const updatedBoards = existingBoards.filter((board: Board) => board.id !== boardId);
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your boards</h1>
          <p className="text-muted-foreground mt-2">
            {state.boards.length} boards
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className='mb-2'>Board name</Label>
                <Input
                  id="title"
                  placeholder="Like Places to go or Recipes to try"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description" className='mb-2'>Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="What's your board about?"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private" className="flex items-center space-x-2">
                  {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  <span>{isPrivate ? 'Keep this board secret' : 'Visible to everyone'}</span>
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateBoard} disabled={!newBoardTitle.trim()}>
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Boards Grid */}
      {state.boards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {state.boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={() => handleDeleteBoard(board.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Plus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-4">Create your first board</h2>
          <p className="text-muted-foreground mb-6">
            Boards are a great way to organize your pins
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create board
          </Button>
        </div>
      )}
    </div>
  );
}

function BoardCard({ board, onDelete }: { board: Board; onDelete: () => void }) {
  return (
    <div className="group relative">
      <Link href={`/boards/${board.id}`}>
        <div className="aspect-square bg-muted rounded-2xl overflow-hidden mb-3 relative">
          {board.pins.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 h-full">
              {board.pins.slice(0, 4).map((pin, index) => (
                <img
                  key={pin.id}
                  src={pin.imageUrl}
                  alt={pin.title}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold truncate">{board.title}</h3>
            {board.isPrivate && <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground">
            {board.pins.length} pins
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit board
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
