'use client';

import { useEffect, useState } from 'react';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChefHat, Home, Palette, Pin, Shirt, Shuffle, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { pins, loading, error, hasMore, loadPins, loadRandomPins } = usePinsActions();
  
  // Initialize localStorage
  useLocalStorage();

  useEffect(() => {
    // Load initial pins
    loadPins(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPins(nextPage, false);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadRandomPins();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => loadPins(1, true)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-background py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get your next
          </h1>
          <div className="text-4xl pb-2 md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            great idea
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover recipes, home ideas, style inspiration and other ideas to try.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 justify-center mb-8">
  <Button variant="outline" onClick={handleRefresh}>
    <Shuffle className="h-4 w-4 mr-2" />
    Surprise me
  </Button>
  <Button variant="outline" onClick={() => loadPins(1, true)}>
    <TrendingUp className="h-4 w-4 mr-2" />
    Popular
  </Button>
  <Button variant="outline">
    <Home className="h-4 w-4 mr-2" />
    Home decor
  </Button>
  <Button variant="outline">
    <ChefHat className="h-4 w-4 mr-2" />
    Recipes
  </Button>
  <Button variant="outline">
    <Shirt className="h-4 w-4 mr-2" />
    Fashion
  </Button>
  <Button variant="outline">
    <Palette className="h-4 w-4 mr-2" />
    Art
  </Button>
</div>
      </section>

      {/* Pins Grid */}
      {pins.length > 0 ? (
        <MasonryGrid
          pins={pins}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      ) : loading ? (
        <LoadingSkeleton />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <Skeleton className="w-full rounded-2xl" style={{ height: `${Math.random() * 200 + 200}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4"><Pin/></div>
        <h2 className="text-2xl font-bold mb-4">No pins found</h2>
        <p className="text-muted-foreground mb-6">
          Try searching for something else or check your internet connection.
        </p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
