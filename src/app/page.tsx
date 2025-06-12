'use client';

import { useEffect } from 'react';
import { MasonryGrid } from '@/components/pin/MasonryGrid';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHomePageState } from '@/hooks/useHomePageState';

// Components
import { HeroSection } from '@/components/home/HeroSection';
import { QuickActionsSection } from '@/components/home/QuickActionsSection';
import { ResultsCounter } from '@/components/home/ResultsCounter';
import { LoadingSkeleton } from '@/components/home/LoadingSkeleton';
import { EmptyState } from '@/components/home/EmptyState';
import { HomeErrorBoundary } from '@/components/home/HomeErrorBoundary';

export default function HomePage() {
  // جدا کردن hooks برای جلوگیری از circular dependency
  const {
    pins,
    loading,
    error,
    hasMore,
    loadPins,
    loadRandomPins,
    searchForPins,
  } = usePinsActions();
  const {
    currentPage,
    activeCategory,
    setCurrentPage,
    setActiveCategory,
    resetState,
  } = useHomePageState();

  // Initialize localStorage
  useLocalStorage();

  // Load initial pins on mount - فقط یکبار
  useEffect(() => {
    loadPins(1, true);
  }, []); // خالی گذاشتن dependency array

  // Actions
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
    resetState();
    loadRandomPins();
  };

  const handlePopular = () => {
    resetState();
    loadPins(1, true);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    searchForPins(category, 1);
  };

  const handleClearCategory = () => {
    resetState();
    loadPins(1, true);
  };

  // Handle retry for error state
  const handleRetry = () => {
    loadPins(1, true);
  };

  // Render error state
  if (error) {
    return <HomeErrorBoundary error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      <QuickActionsSection
        activeCategory={activeCategory}
        isLoading={loading}
        onRefresh={handleRefresh}
        onPopular={handlePopular}
        onCategoryClick={handleCategoryClick}
        onClearCategory={handleClearCategory}
      />

      <ResultsCounter count={pins.length} activeCategory={activeCategory} />

      <HomeContent
        pins={pins}
        loading={loading}
        hasMore={hasMore}
        activeCategory={activeCategory}
        onLoadMore={handleLoadMore}
        onRetry={handlePopular}
      />
    </div>
  );
}

// Separate component for content rendering logic
interface HomeContentProps {
  pins: any[];
  loading: boolean;
  hasMore: boolean;
  activeCategory: string;
  onLoadMore: () => void;
  onRetry: () => void;
}

function HomeContent({
  pins,
  loading,
  hasMore,
  activeCategory,
  onLoadMore,
  onRetry,
}: HomeContentProps) {
  // Show pins grid if we have pins
  if (pins.length > 0) {
    return (
      <MasonryGrid
        pins={pins}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />
    );
  }

  // Show loading skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show empty state when no pins and not loading
  return <EmptyState activeCategory={activeCategory} onRetry={onRetry} />;
}
