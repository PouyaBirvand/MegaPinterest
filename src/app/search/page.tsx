'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Button } from '@/components/ui/button';
import { usePinsActions } from '@/hooks/usePinsActions';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    orientation: 'all',
    color: '',
  });

  const { pins, loading, error, hasMore, searchForPins } = usePinsActions();

  useEffect(() => {
    if (query) {
      setCurrentPage(1);
      searchForPins(query, 1, filters);
    }
  }, [query, filters]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchForPins(query, nextPage, filters);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Search Pinterest</h1>
        <p className="text-muted-foreground">
          Enter a search term to find amazing ideas
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">
            Search results for {query}
          </h1>
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      {/* Results */}
      {error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => searchForPins(query, 1, filters)}>
            Try Again
          </Button>
        </div>
      ) : pins.length > 0 ? (
        <>
          <div className="container mx-auto px-4 py-4">
            <p className="text-muted-foreground">
              {pins.length} pins found
            </p>
          </div>
          <MasonryGrid
            pins={pins}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </>
      ) : loading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-4">No results found</h2>
          <p className="text-muted-foreground">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
}
