'use client';

import { useState, useCallback } from 'react';
import {
  BoardsPageState,
  ViewMode,
  SortOption,
  FilterOption,
} from '@/types/boards.types';

const initialState: BoardsPageState = {
  searchQuery: '',
  sortBy: 'newest',
  filterBy: 'all',
  viewMode: 'grid',
  showFilters: false,
  selectedBoards: [],
};

export function useBoardsPageState() {
  const [state, setState] = useState<BoardsPageState>(initialState);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setState(prev => ({ ...prev, sortBy }));
  }, []);

  const setFilterBy = useCallback((filterBy: FilterOption) => {
    setState(prev => ({ ...prev, filterBy }));
  }, []);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode }));
  }, []);

  const toggleFilters = useCallback(() => {
    setState(prev => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  const setSelectedBoards = useCallback((boards: string[]) => {
    setState(prev => ({ ...prev, selectedBoards: boards }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      filterBy: 'all',
      selectedBoards: [],
    }));
  }, []);

  const toggleBoardSelection = useCallback((boardId: string) => {
    setState(prev => ({
      ...prev,
      selectedBoards: prev.selectedBoards.includes(boardId)
        ? prev.selectedBoards.filter(id => id !== boardId)
        : [...prev.selectedBoards, boardId],
    }));
  }, []);

  return {
    ...state,
    setSearchQuery,
    setSortBy,
    setFilterBy,
    setViewMode,
    toggleFilters,
    setSelectedBoards,
    clearFilters,
    toggleBoardSelection,
  };
}
