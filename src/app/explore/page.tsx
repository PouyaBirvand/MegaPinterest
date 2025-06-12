'use client';

import { useEffect, useState, useCallback } from 'react';
import { useExploreFilters } from '@/hooks/useExploreFilters';
import { useExplorePins } from '@/hooks/useExplorePins';
import { usePinSorting } from '@/hooks/usePinSorting';
import { HeroSection } from '@/components/explore/HeroSection';
import { CategoryGrid } from '@/components/explore/CategoryGrid';
import { FilterControls } from '@/components/explore/FilterControls';
import { ResultsSection } from '@/components/explore/ResultsSection';
import { ErrorBoundary } from '@/components/explore/ErrorBoundary';

export default function ExplorePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const { filters, updateFilter, clearSearch } = useExploreFilters();
  const {
    pins,
    loading,
    error,
    hasMore,
    loadRandomPins,
    clearPins,
    handleSearch: performSearch,
    handleCategorySelect: performCategorySelect,
    handleTabChange: performTabChange,
    handleLoadMore: performLoadMore,
  } = useExplorePins();

  // استفاده از hook برای sorting
  const { sortedPins, totalCount } = usePinSorting({
    pins,
    sortType: filters.sortBy,
    searchQuery: filters.query,
  });

  // Initialize page - فقط یک بار اجرا شود
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      clearPins();
      loadRandomPins();
    }
  }, []); // dependency array خالی

  // Event Handlers با useCallback
  const handleSearch = useCallback(
    (query: string) => {
      updateFilter('query', query);
      updateFilter('category', '');
      setCurrentPage(1);
      performSearch(query);
    },
    [updateFilter, performSearch]
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      updateFilter('category', category);
      updateFilter('query', '');
      setCurrentPage(1);
      performCategorySelect(category);
    },
    [updateFilter, performCategorySelect]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      updateFilter('activeTab', tab as any);
      updateFilter('query', '');
      updateFilter('category', '');
      setCurrentPage(1);
      performTabChange(tab);
    },
    [updateFilter, performTabChange]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = performLoadMore(currentPage, filters.query);
    setCurrentPage(nextPage);
  }, [performLoadMore, currentPage, filters.query]);

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      updateFilter('sortBy', newSortBy as any);
    },
    [updateFilter]
  );

  const handleClearFilter = useCallback(() => {
    clearSearch();
    setCurrentPage(1);
    loadRandomPins();
  }, [clearSearch, loadRandomPins]);

  const handleRetry = useCallback(() => {
    clearPins();
    loadRandomPins();
  }, [clearPins, loadRandomPins]);

  if (error) {
    return <ErrorBoundary error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection searchQuery={filters.query} onSearch={handleSearch} />

      <CategoryGrid
        selectedCategory={filters.category}
        onCategorySelect={handleCategorySelect}
      />

      <FilterControls
        activeTab={filters.activeTab}
        sortBy={filters.sortBy}
        onTabChange={handleTabChange}
        onSortChange={handleSortChange}
      />

      <ResultsSection
        pins={sortedPins}
        loading={loading}
        hasMore={hasMore}
        selectedCategory={filters.category}
        searchQuery={filters.query}
        sortBy={filters.sortBy}
        totalCount={totalCount}
        onLoadMore={handleLoadMore}
        onClearFilter={handleClearFilter}
        onRetry={handleRetry}
      />
    </div>
  );
}
