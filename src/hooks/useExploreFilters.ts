import { useState, useCallback } from 'react';
import { SearchFilters } from '@/types/explore.types';
import { DEFAULT_FILTERS } from '@/lib/constants/explore.constants';

export function useExploreFilters(initialFilters?: Partial<SearchFilters>) {
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters(prev => {
        // جلوگیری از update غیرضروری
        if (prev[key] === value) return prev;
        return { ...prev, [key]: value };
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      query: '',
      category: '',
    }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    clearSearch,
  };
}
