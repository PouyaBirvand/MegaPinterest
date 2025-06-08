'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Edit, Trash2, Share, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { useBoards } from '@/contexts/BoardsContext';
import { Board } from '@/types';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  const { state, dispatch } = useBoards();
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const foundBoard = state.boards.find(b => b.id === boardId);
    setBoard(foundBoard || null);
  }, [boardId, state.boards]);

  const handleDeleteBoard = () => {
    if (confirm('Are you sure you want to delete this board?')) {
      dispatch({ type: 'DELETE_BOARD', payload: boardId });
      
      // Update localStorage
      const existingBoards = JSON.parse(localStorage.getItem('boards') || '[]');
      const updatedBoards = existingBoards.filter((b: Board) => b.id !== boardId);
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      
      router.push('/boards');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: board?.title,
        text: board?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Board not found</h1>
        <Button onClick={() => router.push('/boards')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to boards
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteBoard} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold">{board.title}</h1>
              {board.isPrivate ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            
            {board.description && (
              <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                {board.description}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground">
              {board.pins.length} pins • Created {new Date(board.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Pins */}
      {board.pins.length > 0 ? (
        <MasonryGrid pins={board.pins} />
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-4">Nothing to show...yet!</h2>
            <p className="text-muted-foreground mb-6">
              Pins you add to this board will live here.
            </p>
            <Button onClick={() => router.push('/pin-builder')}>
              Create Pin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
