'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Lock,
  Globe,
  Plus,
  Filter,
  SortAsc,
  Grid,
  List,
  Search,
  Calendar,
  Eye,
  Heart,
  Download,
  ExternalLink,
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
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { useBoards, useBoardsActions } from '@/contexts/BoardsContext';
import { Board } from '@/types';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title' | 'mostLiked';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  const { state } = useBoards();
  const { deleteBoard, updateBoard } = useBoardsActions();

  // State management
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  useEffect(() => {
    if (state.initialized) {
      const foundBoard = state.boards.find(b => b.id === boardId);
      setBoard(foundBoard || null);
      setIsLoading(false);
      
      if (foundBoard) {
        setEditTitle(foundBoard.title);
        setEditDescription(foundBoard.description || '');
        setEditIsPrivate(foundBoard.isPrivate);
      }
    }
  }, [boardId, state.boards, state.initialized]);

  // Get filtered and sorted pins
  const getFilteredPins = () => {
    if (!board) return [];
    
    let filteredPins = board.pins;

    // Search filter
    if (searchQuery) {
      filteredPins = filteredPins.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filteredPins = filteredPins.filter(pin =>
        pin.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredPins = filteredPins.filter(pin =>
        new Date(pin.createdAt) >= cutoff
      );
    }

    // Sort pins
    switch (sortBy) {
      case 'newest':
        filteredPins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredPins.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        filteredPins.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostLiked':
        filteredPins.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }

    return filteredPins;
  };

  // Get all unique tags from pins
  const getAllTags = () => {
    if (!board) return [];
    const tags = new Set<string>();
    board.pins.forEach(pin => {
      pin.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const handleDeleteBoard = () => {
    if (!board) return;
    
    toast(`Delete "${board.title}"?`, {
      description: "This action cannot be undone. All pins in this board will be removed.",
      action: {
        label: "Delete",
        onClick: () => {
          deleteBoard(boardId);
          toast.success('Board deleted successfully');
          router.push('/boards');
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleEditBoard = async () => {
    if (!board || !editTitle.trim() || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updatedBoard: Board = {
        ...board,
        title: editTitle.trim(),
        description: editDescription.trim(),
        isPrivate: editIsPrivate,
      };
      
      updateBoard(updatedBoard);
      setBoard(updatedBoard);
      setShowEditDialog(false);
      toast.success('Board updated successfully');
    } catch (error) {
      toast.error('Failed to update board');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShare = async () => {
    if (!board) return;
    
    const shareData = {
      title: board.title,
      text: board.description || `Check out my ${board.title} board`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share board');
    }
  };

  const handleExportBoard = () => {
    if (!board) return;
    
    const exportData = {
      board: {
        title: board.title,
        description: board.description,
        createdAt: board.createdAt,
        pins: board.pins.map(pin => ({
          title: pin.title,
          description: pin.description,
          imageUrl: pin.imageUrl,
          tags: pin.tags,
          createdAt: pin.createdAt,
        }))
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${board.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_board.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Board exported successfully');
  };

  const filteredPins = getFilteredPins();
  const allTags = getAllTags();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-9 w-20 bg-muted rounded"></div>
                  <div className="h-9 w-9 bg-muted rounded"></div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
                <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
                <div className="h-3 w-48 bg-muted rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Edit className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Board not found</h1>
          <p className="text-muted-foreground mb-6">
            This board might have been deleted or doesn't exist.
          </p>
          <Button onClick={() => router.push('/boards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to boards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-muted"
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportBoard}>
                    <Download className="h-4 w-4 mr-2" />
                    Export board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(window.location.href, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteBoard}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Board Info */}
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
              <span>{board.pins.length} pin{board.pins.length !== 1 ? 's' : ''}</span>
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

          {/* Search and Filters */}
          {board.pins.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pins..."
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
                    {(selectedTags.length > 0 || dateRange !== 'all') && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {selectedTags.length + (dateRange !== 'all' ? 1 : 0)}
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
                      <SelectItem value="title">By title</SelectItem>
                      <SelectItem value="mostLiked">Most liked</SelectItem>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tags Filter */}
                    {allTags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedTags(prev =>
                                  prev.includes(tag)
                                    ? prev.filter(t => t !== tag)
                                    : [...prev, tag]
                                );
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date Range Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Date Range</Label>
                      <Select value={dateRange} onValueChange={(value: typeof dateRange) => setDateRange(value)}>
                        <SelectTrigger>
                          <Calendar className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="week">Last week</SelectItem>
                          <SelectItem value="month">Last month</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedTags.length > 0 || dateRange !== 'all' || searchQuery) && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Showing {filteredPins.length} of {board.pins.length} pins
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTags([]);
                          setDateRange('all');
                          setSearchQuery('');
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {filteredPins.length > 0 ? (
          <div className="space-y-4">
            {/* Results info */}
            {(searchQuery || selectedTags.length > 0 || dateRange !== 'all') && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {filteredPins.length} pin{filteredPins.length !== 1 ? 's' : ''} found
                </span>
                {searchQuery && (
                  <span>Search: "{searchQuery}"</span>
                )}
              </div>
            )}
            
            {viewMode === 'grid' ? (
              <MasonryGrid pins={filteredPins} />
            ) : (
              <div className="space-y-4">
                {filteredPins.map(pin => (
                  <div key={pin.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pin.title}</h3>
                      {pin.description && (
                        <p className="text-muted-foreground text-sm mt-1">{pin.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(pin.createdAt).toLocaleDateString()}</span>
                        </span>
                        {pin.likes && (
                          <span className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{pin.likes}</span>
                          </span>
                        )}
                        {pin.views && (
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{pin.views}</span>
                          </span>
                        )}
                      </div>
                      {pin.tags && pin.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pin.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : board.pins.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nothing to show...yet!</h2>
              <p className="text-muted-foreground mb-8">
                Pins you add to this board will live here. Start building your collection!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push('/pin-builder')} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Pin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  size="lg"
                >
                  Browse Pins
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-4">No pins match your filters</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                  setDateRange('all');
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>

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

