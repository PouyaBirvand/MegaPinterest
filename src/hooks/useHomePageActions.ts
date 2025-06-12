'use client';

import { useCallback } from 'react';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useHomePageState } from '@/hooks/useHomePageState';

export function useHomePageActions() {
  const {
    currentPage,
    activeCategory,
    setCurrentPage,
    setActiveCategory,
    resetState,
  } = useHomePageState();

  const { loadPins, loadRandomPins, searchForPins } = usePinsActions();

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    if (activeCategory) {
      searchForPins(activeCategory, nextPage);
    } else {
      loadPins(nextPage, false);
    }
  }, [currentPage, activeCategory, setCurrentPage, searchForPins, loadPins]);

  const handleRefresh = useCallback(() => {
    resetState();
    loadRandomPins();
  }, [resetState, loadRandomPins]);

  const handlePopular = useCallback(() => {
    resetState();
    loadPins(1, true);
  }, [resetState, loadPins]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setActiveCategory(category);
      searchForPins(category, 1);
    },
    [setActiveCategory, searchForPins]
  );

  const handleClearCategory = useCallback(() => {
    resetState();
    loadPins(1, true);
  }, [resetState, loadPins]);

  return {
    currentPage,
    activeCategory,
    handleLoadMore,
    handleRefresh,
    handlePopular,
    handleCategoryClick,
    handleClearCategory,
  };
}
