'use client';

import { useState, useMemo } from 'react';
import { Pin } from '@/types';
import { BoardPageState, SortOption, DateRange } from '@/types/boardPage.types';

export function useBoardFilters(pins: Pin[]) {
  const [filters, setFilters] = useState<BoardPageState>({
    searchQuery: '',
    sortBy: 'newest' as SortOption,
    viewMode: 'grid',
    showFilters: false,
    selectedTags: [],
    dateRange: 'all' as DateRange,
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pins.forEach(pin => {
      pin.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [pins]);

  const filteredPins = useMemo(() => {
    let result = [...pins];

    // Search filter
    if (filters.searchQuery) {
      result = result.filter(
        pin =>
          pin.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          pin.description
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          pin.tags?.some(tag =>
            tag.toLowerCase().includes(filters.searchQuery.toLowerCase())
          )
      );
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      result = result.filter(pin =>
        pin.tags?.some(tag => filters.selectedTags.includes(tag))
      );
    }

    // Date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (filters.dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      result = result.filter(pin => new Date(pin.createdAt) >= cutoff);
    }

    // Sort pins
    switch (filters.sortBy) {
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
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostLiked':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }

    return result;
  }, [pins, filters]);

  const updateFilters = (updates: Partial<BoardPageState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearAllFilters = () => {
    setFilters(prev => ({
      ...prev,
      searchQuery: '',
      selectedTags: [],
      dateRange: 'all',
    }));
  };

  const hasActiveFilters =
    filters.selectedTags.length > 0 ||
    filters.dateRange !== 'all' ||
    filters.searchQuery.length > 0;

  return {
    filters,
    filteredPins,
    allTags,
    updateFilters,
    clearAllFilters,
    hasActiveFilters,
  };
}
