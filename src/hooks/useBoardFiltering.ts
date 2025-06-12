'use client';

import { useMemo } from 'react';
import { Board } from '@/types';
import { SortOption, FilterOption } from '@/types/boards.types';

export function useBoardFiltering(
  boards: Board[],
  searchQuery: string,
  sortBy: SortOption,
  filterBy: FilterOption
) {
  const filteredBoards = useMemo(() => {
    let result = [...boards];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        board =>
          board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          board.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    switch (filterBy) {
      case 'private':
        result = result.filter(board => board.isPrivate);
        break;
      case 'public':
        result = result.filter(board => !board.isPrivate);
        break;
      case 'empty':
        result = result.filter(board => board.pins.length === 0);
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter(board => new Date(board.createdAt) >= weekAgo);
        break;
    }

    // Sort boards
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'title':
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostPins':
        result.sort((a, b) => b.pins.length - a.pins.length);
        break;
    }

    return result;
  }, [boards, searchQuery, sortBy, filterBy]);

  return filteredBoards;
}
