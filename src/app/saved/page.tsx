'use client';

import { useState } from 'react';
import { Bookmark, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { usePinsActions } from '@/hooks/usePinsActions';

export default function SavedPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { savedPins } = usePinsActions();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="h-8 w-8 mr-3" />
            Saved pins
          </h1>
          <p className="text-muted-foreground mt-2">
            {savedPins.length} pins saved
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {savedPins.length > 0 ? (
        <MasonryGrid pins={savedPins} />
      ) : (
        <div className="text-center py-16">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-4">Nothing saved yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and save pins you love
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Explore pins
          </Button>
        </div>
      )}
    </div>
  );
}
