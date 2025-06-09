'use client';

import { useEffect, useState } from 'react';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  ChefHat,
  Home,
  Palette,
  Pin,
  Shirt,
  Shuffle,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const {
    pins,
    loading,
    error,
    hasMore,
    loadPins,
    loadRandomPins,
    searchForPins,
  } = usePinsActions();

  // Initialize localStorage
  useLocalStorage();

  useEffect(() => {
    // Load initial pins
    loadPins(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    if (activeCategory) {
      searchForPins(activeCategory, nextPage);
    } else {
      loadPins(nextPage, false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setActiveCategory('');
    loadRandomPins();
  };

  const handlePopular = () => {
    setCurrentPage(1);
    setActiveCategory('');
    loadPins(1, true);
  };

  const handleCategoryClick = (category: string) => {
    setCurrentPage(1);
    setActiveCategory(category);
    searchForPins(category, 1);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => loadPins(1, true)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-background py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Get your next</h1>
          <div className="text-4xl pb-2 md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            great idea
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover recipes, home ideas, style inspiration and other ideas to
            try.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-6">
        {/* Active Category Display */}
        {activeCategory && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <span className="text-sm font-medium">
                Showing: {activeCategory}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveCategory('');
                  setCurrentPage(1);
                  loadPins(1, true);
                }}
                className="h-auto p-1 hover:bg-primary/20"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={activeCategory === '' && !loading ? 'default' : 'outline'}
            onClick={handleRefresh}
            disabled={loading}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Surprise me
          </Button>

          <Button
            variant={activeCategory === '' && !loading ? 'default' : 'outline'}
            onClick={handlePopular}
            disabled={loading}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular
          </Button>

          <Button
            variant={activeCategory === 'home decor' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('home decor')}
            disabled={loading}
          >
            <Home className="h-4 w-4 mr-2" />
            Home decor
          </Button>

          <Button
            variant={activeCategory === 'recipes' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('recipes')}
            disabled={loading}
          >
            <ChefHat className="h-4 w-4 mr-2" />
            Recipes
          </Button>

          <Button
            variant={activeCategory === 'fashion' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('fashion')}
            disabled={loading}
          >
            <Shirt className="h-4 w-4 mr-2" />
            Fashion
          </Button>

          <Button
            variant={activeCategory === 'art' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('art')}
            disabled={loading}
          >
            <Palette className="h-4 w-4 mr-2" />
            Art
          </Button>
        </div>
      </section>

      {/* Results Count */}
      {pins.length > 0 && (
        <section className="container mx-auto px-4 pb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {pins.length} pins found
              {activeCategory && ` for "${activeCategory}"`}
            </p>
          </div>
        </section>
      )}

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
        <EmptyState activeCategory={activeCategory} onRetry={handlePopular} />
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
            <Skeleton
              className="w-full rounded-2xl"
              style={{ height: `${Math.random() * 200 + 200}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  activeCategory,
  onRetry,
}: {
  activeCategory?: string;
  onRetry: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl flex items-center justify-center gap-3 font-bold mb-4">
          {activeCategory ? `No ${activeCategory} pins found` : 'No pins found'}
          <Pin />
        </h2>
        <p className="text-muted-foreground mb-6">
          {activeCategory
            ? `Try searching for different ${activeCategory} ideas or browse other categories.`
            : 'Try searching for something else or check your internet connection.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={onRetry}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Show Popular
          </Button>
          {activeCategory && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Shuffle className="h-4 w-4 mr-2" />
              Try Random
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
