'use client';

import { useState, useCallback, useMemo } from 'react';
import { HomePageState } from '@/types/home.types';
import { INITIAL_PAGE } from '@/lib/constants/categories.constants';

export function useHomePageState() {
  const [state, setState] = useState<HomePageState>({
    currentPage: INITIAL_PAGE,
    activeCategory: '',
  });

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setActiveCategory = useCallback((category: string) => {
    setState(prev => ({
      ...prev,
      activeCategory: category,
      currentPage: INITIAL_PAGE,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      currentPage: INITIAL_PAGE,
      activeCategory: '',
    });
  }, []);

  // Memoized computed values
  const computedValues = useMemo(
    () => ({
      hasActiveCategory: Boolean(state.activeCategory),
      isFirstPage: state.currentPage === INITIAL_PAGE,
    }),
    [state.activeCategory, state.currentPage]
  );

  return {
    ...state,
    ...computedValues,
    setCurrentPage,
    setActiveCategory,
    resetState,
  };
}
