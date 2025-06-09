'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Globe,
  Plus,
  Filter,
  SortAsc,
  Grid,
  List,
  Search,
  Calendar,
  Download,
  Copy,
  ShareIcon,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useBoards, useBoardsActions } from '@/contexts/BoardsContext';
import { Board } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title' | 'mostLiked' | 'alphabetical' | 'mostPins';
type FilterOption = 'all' | 'private' | 'public' | 'empty' | 'recent'; // این خط را اضافه کنید

export default function BoardsPage() {
  const { state } = useBoards();
  const { createBoard, deleteBoard, updateBoard } = useBoardsActions();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // Form states
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);

  // Filter and view states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);

  // Get filtered and sorted boards
  const getFilteredBoards = () => {
    let filteredBoards = state.boards;

    // Search filter
    if (searchQuery) {
      filteredBoards = filteredBoards.filter(board =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    switch (filterBy) {
      case 'private':
        filteredBoards = filteredBoards.filter(board => board.isPrivate);
        break;
      case 'public':
        filteredBoards = filteredBoards.filter(board => !board.isPrivate);
        break;
      case 'empty':
        filteredBoards = filteredBoards.filter(board => board.pins.length === 0);
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredBoards = filteredBoards.filter(board => 
          new Date(board.createdAt) >= weekAgo
        );
        break;
    }

    // Sort boards
    switch (sortBy) {
      case 'newest':
        filteredBoards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredBoards.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
      case 'alphabetical':
        filteredBoards.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostPins':
        filteredBoards.sort((a, b) => b.pins.length - a.pins.length);
        break;
    }

    return filteredBoards;
  };

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      createBoard({
        title: newBoardTitle.trim(),
        description: newBoardDescription.trim(),
        pins: [],
        isPrivate,
      });
      
      // Reset form
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsPrivate(false);
      setShowCreateDialog(false);
      toast.success('Board created successfully!');
    } catch (error) {
      toast.error('Failed to create board');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditBoard = async () => {
    if (!editingBoard || !editTitle.trim() || isUpdating) return;

    setIsUpdating(true);
    try {
      const updatedBoard: Board = {
        ...editingBoard,
        title: editTitle.trim(),
        description: editDescription.trim(),
        isPrivate: editIsPrivate,
      };

      updateBoard(updatedBoard);
      setShowEditDialog(false);
      setEditingBoard(null);
      toast.success('Board updated successfully!');
    } catch (error) {
      toast.error('Failed to update board');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBoard = (boardId: string, boardTitle: string) => {
    console.log('Delete board called:', boardId, boardTitle); // این خط را اضافه کنید
    toast(`Delete "${boardTitle}"?`, {
      description: "This action cannot be undone. All pins in this board will be removed.",
      action: {
        label: "Delete",
        onClick: () => {
          console.log('Deleting board:', boardId); // این خط را هم اضافه کنید
          deleteBoard(boardId);
          toast.success('Board deleted successfully');
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  
  const handleDuplicateBoard = (board: Board) => {
    createBoard({
      title: `${board.title} (Copy)`,
      description: board.description,
      pins: [...board.pins],
      isPrivate: board.isPrivate,
    });
    toast.success('Board duplicated successfully!');
  };

  const handleBulkDelete = () => {
    if (selectedBoards.length === 0) return;

    toast(`Delete ${selectedBoards.length} board${selectedBoards.length > 1 ? 's' : ''}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete All",
        onClick: () => {
          selectedBoards.forEach(boardId => deleteBoard(boardId));
          setSelectedBoards([]);
          toast.success(`${selectedBoards.length} board${selectedBoards.length > 1 ? 's' : ''} deleted`);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const openEditDialog = (board: Board) => {
    setEditingBoard(board);
    setEditTitle(board.title);
    setEditDescription(board.description || '');
    setEditIsPrivate(board.isPrivate);
    setShowEditDialog(true);
  };

  const filteredBoards = getFilteredBoards();

  if (!state.initialized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-2xl"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your boards</h1>
            <p className="text-muted-foreground mt-2">
              {state.boards.length} board{state.boards.length !== 1 ? 's' : ''}
              {searchQuery && ` • ${filteredBoards.length} matching`}
              {selectedBoards.length > 0 && ` • ${selectedBoards.length} selected`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedBoards.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedBoards.length})
              </Button>
            )}

            {/* Create Board Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create board
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create new board</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Board name *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Travel Ideas, Recipe Collection..."
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      {newBoardTitle.length}/50 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What's this board about?"
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      maxLength={200}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {newBoardDescription.length}/200 characters
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                    <div className="flex items-center space-x-3">
                      {isPrivate ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <Label htmlFor="private" className="font-medium cursor-pointer">
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
                      id="private"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>
                </div>

                <DialogFooter className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    disabled={isCreating}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBoard}
                    disabled={!newBoardTitle.trim() || isCreating}
                    className="flex-1"
                  >
                    {isCreating ? 'Creating...' : 'Create Board'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        {state.boards.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search boards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-muted' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {filterBy !== 'all' && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="alphabetical">A to Z</SelectItem>
                    <SelectItem value="mostPins">Most pins</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Button
                    variant={filterBy === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('all')}
                  >
                    All boards
                  </Button>
                  <Button
                    variant={filterBy === 'recent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('recent')}
                  >
                    Recent
                  </Button>
                  <Button
                    variant={filterBy === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('private')}
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Button>
                  <Button
                    variant={filterBy === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('public')}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Button>
                  <Button
                    variant={filterBy === 'empty' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy('empty')}
                  >
                    Empty
                  </Button>
                </div>

                {(filterBy !== 'all' || searchQuery) && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredBoards.length} of {state.boards.length} boards
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilterBy('all');
                        setSearchQuery('');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {filteredBoards.length > 0 ? (
        <div className="space-y-4">
          {/* Bulk Actions */}
          {selectedBoards.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedBoards.length} board{selectedBoards.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBoards([])}
                  >
                    Clear selection
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredBoards.map((board) => (
                <div key={board.id} className="group relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="checkbox"
                      checked={selectedBoards.includes(board.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBoards(prev => [...prev, board.id]);
                        } else {
                          setSelectedBoards(prev => prev.filter(id => id !== board.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-2 border-white bg-white/90 backdrop-blur-sm"
                    />
                  </div>

                  {/* Board Card */}
                  <Link href={`/boards/${board.id}`} className="block">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group-hover:shadow-lg transition-all duration-200">
                      {board.pins.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 h-full">
                          {board.pins.slice(0, 4).map((pin, index) => (
                            <div
                              key={pin.id}
                              className={`relative overflow-hidden ${
                                board.pins.length === 1 ? 'col-span-2' :
                                board.pins.length === 3 && index === 0 ? 'col-span-2' : ''
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
                          {board.pins.length > 4 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              +{board.pins.length - 4}
                            </div>
                          )}
                        </div>
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
                          <DropdownMenuItem onClick={() => openEditDialog(board)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit board
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateBoard(board)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShareIcon className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>                        
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteBoard(board.id, board.title)}
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
                        <span>{board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}</span>
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
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {filteredBoards.map((board) => (
                <div
                  key={board.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-all group"
                >
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedBoards.includes(board.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBoards(prev => [...prev, board.id]);
                      } else {
                        setSelectedBoards(prev => prev.filter(id => id !== board.id));
                      }
                    }}
                    className="w-4 h-4 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Board Thumbnail */}
                  <Link href={`/boards/${board.id}`}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {board.pins.length > 0 ? (
                        <Image
                          src={board.pins[0].imageUrl}
                          width={50}
                          height={50}
                          alt={board.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Plus className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Board Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/boards/${board.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                        {board.title}
                      </h3>
                    </Link>
                    {board.description && (
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span>{board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}</span>
                      {board.isPrivate && (
                        <span className="flex items-center space-x-1">
                          <Lock className="h-3 w-3" />
                          <span>Private</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Board actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(board)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit board
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateBoard(board)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShareIcon className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteBoard(board.id, board.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : state.boards.length === 0 ? (
        // Empty State - No boards
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Create your first board</h2>
            <p className="text-muted-foreground mb-8">
              Boards are a great way to organize your pins. Create one to get started!
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Board
            </Button>
          </div>
        </div>
      ) : (
        // Empty State - No filtered results
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-4">No boards found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                }}
              >
                Clear filters
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Board
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Board Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Board name *</Label>
              <Input
                id="edit-title"
                placeholder="Board name"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {editTitle.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="What's this board about?"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                maxLength={200}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {editDescription.length}/200 characters
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center space-x-3">
                {editIsPrivate ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="edit-private" className="font-medium cursor-pointer">
                    {editIsPrivate ? 'Private board' : 'Public board'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {editIsPrivate
                      ? 'Only you can see this board'
                      : 'Anyone can see this board'}
                  </p>
                </div>
              </div>
              <Switch
                id="edit-private"
                checked={editIsPrivate}
                onCheckedChange={setEditIsPrivate}
              />
            </div>
          </div>

          <DialogFooter className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isUpdating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditBoard}
              disabled={!editTitle.trim() || isUpdating}
              className="flex-1"
            >
              {isUpdating ? 'Updating...' : 'Update Board'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
