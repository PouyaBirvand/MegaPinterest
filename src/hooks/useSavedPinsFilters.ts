import { useState, useMemo } from 'react';
import { Pin } from '@/types';
import { FilterOption, Saved_Filters } from '@/types/saved.types';

export function useSavedPinsFilters(pins: Pin[]) {
  const [filters, setFilters] = useState<Saved_Filters>({
    searchQuery: '',
    sortBy: 'newest',
    filterBy: 'all',
  });

  const updateFilter = <K extends keyof Saved_Filters>(
    key: K,
    value: Saved_Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      sortBy: 'newest',
      filterBy: 'all',
    });
  };

  const filteredAndSortedPins = useMemo(() => {
    return filterAndSortPins(pins, filters);
  }, [pins, filters]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    pins.forEach(pin => {
      pin.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [pins]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedPins,
    availableTags,
  };
}

function filterAndSortPins(pins: Pin[], filters: Saved_Filters): Pin[] {
  let filtered = [...pins];

  // Apply search filter
  if (filters.searchQuery) {
    filtered = filtered.filter(
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

  // Apply date filter
  if (filters.filterBy !== 'all') {
    const filterDate = getFilterDate(filters.filterBy);
    filtered = filtered.filter(pin => {
      const pinDate = new Date(pin.savedAt || pin.createdAt);
      return pinDate >= filterDate;
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return (
          new Date(b.savedAt || b.createdAt).getTime() -
          new Date(a.savedAt || a.createdAt).getTime()
        );
      case 'oldest':
        return (
          new Date(a.savedAt || a.createdAt).getTime() -
          new Date(b.savedAt || b.createdAt).getTime()
        );
      case 'title':
        return a.title.localeCompare(b.title);
      case 'most-liked':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return 0;
    }
  });

  return filtered;
}

function getFilterDate(filterBy: FilterOption): Date {
  const now = new Date();
  const filterDate = new Date();

  switch (filterBy) {
    case 'today':
      filterDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      filterDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      filterDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return filterDate;
}
