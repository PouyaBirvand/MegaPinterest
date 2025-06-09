'use client';
import { useState, useMemo } from 'react';
import {
  Bookmark,
  Grid,
  List,
  Search,
  Calendar,
  Tag,
  Trash2,
  LucideAlignCenterHorizontal,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { SavedPinsList } from '@/components/pins/SavedPinsList';
import { usePins } from '@/contexts/PinsContext';
import { usePinsActions } from '@/contexts/PinsContext';

type SortOption = 'newest' | 'oldest' | 'title' | 'most-liked';
type FilterOption = 'all' | 'today' | 'week' | 'month' | 'year';

export default function SavedPage() {
  const { state } = usePins();
  const { unsavePin } = usePinsActions();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedPins, setSelectedPins] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Check if there are any saved pins
  const hasSavedPins = state.savedPins.length > 0;

  // Get unique tags from saved pins
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    state.savedPins.forEach(pin => {
      pin.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [state.savedPins]);

  // Filter and sort pins
  const filteredAndSortedPins = useMemo(() => {
    let filtered = [...state.savedPins];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Date filter
    if (filterBy !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterBy) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(pin => {
        const pinDate = new Date(pin.savedAt || pin.createdAt);
        return pinDate >= filterDate;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedAt || b.createdAt).getTime() -
                 new Date(a.savedAt || a.createdAt).getTime();
        case 'oldest':
          return new Date(a.savedAt || a.createdAt).getTime() -
                 new Date(b.savedAt || b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'most-liked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.savedPins, searchQuery, sortBy, filterBy]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedPins.length === filteredAndSortedPins.length) {
      setSelectedPins([]);
    } else {
      setSelectedPins(filteredAndSortedPins.map(pin => pin.id));
    }
  };

  const handleSelectPin = (pinId: string) => {
    setSelectedPins(prev =>
      prev.includes(pinId)
        ? prev.filter(id => id !== pinId)
        : [...prev, pinId]
    );
  };

  const handleBulkDelete = () => {
    selectedPins.forEach(pinId => unsavePin(pinId));
    setSelectedPins([]);
    setIsSelectionMode(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="h-8 w-8 mr-3 text-primary" />
            Saved pins
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">
              {filteredAndSortedPins.length} of {state.savedPins.length} pins
            </p>
            {selectedPins.length > 0 && (
              <Badge variant="secondary">
                {selectedPins.length} selected
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action Buttons - Only show if there are saved pins */}
        {hasSavedPins && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Selection Mode Toggle */}
            <Button
              variant={isSelectionMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedPins([]);
              }}
            >
              <LucideAlignCenterHorizontal className="h-4 w-4 mr-2" />
              Select
            </Button>
            
            {/* Bulk Actions */}
            {isSelectionMode && selectedPins.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedPins.length})
                </Button>
            )}
            
            {/* View Mode Toggle */}
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
        )}
      </div>

      {/* Filters and Search - Only show if there are saved pins */}
      {hasSavedPins && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved pins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="most-liked">Most liked</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter by Date */}
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selection Header */}
          {isSelectionMode && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
              <Checkbox
                checked={selectedPins.length === filteredAndSortedPins.length && filteredAndSortedPins.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Select all ({filteredAndSortedPins.length} pins)
              </span>
            </div>
          )}
        </>
      )}

      {/* Content */}
      {filteredAndSortedPins.length > 0 ? (
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="grid">
            <MasonryGrid 
              pins={filteredAndSortedPins}
              selectionMode={isSelectionMode}
              selectedPins={selectedPins}
              onSelectPin={handleSelectPin}
            />
          </TabsContent>
          <TabsContent value="list">
            <SavedPinsList 
              pins={filteredAndSortedPins}
              selectionMode={isSelectionMode}
              selectedPins={selectedPins}
              onSelectPin={handleSelectPin}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-16">
          {hasSavedPins && (searchQuery || filterBy !== 'all') ? (
            <>
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-4">No pins found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setFilterBy('all')}
                >
                  Clear filters
                </Button>
              </div>
            </>
          ) : (
            <>
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-4">Nothing saved yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and save pins you love
              </p>
              <Button className='flex items-center gap-4 mx-auto' onClick={() => (window.location.href = '/')}>
                <Camera/>
                Explore pins
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
