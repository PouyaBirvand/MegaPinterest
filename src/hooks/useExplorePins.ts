import { useCallback } from 'react';
import { usePinsActions } from '@/hooks/usePinsActions';

export function useExplorePins() {
  const pinsActions = usePinsActions();

  const handleSearch = useCallback(
    (query: string) => {
      pinsActions.clearPins();
      if (query.trim()) {
        pinsActions.searchForPins(query.trim(), 1);
      } else {
        pinsActions.loadRandomPins();
      }
    },
    [
      pinsActions.clearPins,
      pinsActions.searchForPins,
      pinsActions.loadRandomPins,
    ]
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      pinsActions.clearPins();
      pinsActions.searchForPins(category, 1);
    },
    [pinsActions.clearPins, pinsActions.searchForPins]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      pinsActions.clearPins();
      switch (tab) {
        case 'trending':
          pinsActions.loadRandomPins();
          break;
        case 'recent':
          pinsActions.loadPins(1, true);
          break;
        default:
          pinsActions.loadRandomPins();
      }
    },
    [pinsActions.clearPins, pinsActions.loadRandomPins, pinsActions.loadPins]
  );

  const handleLoadMore = useCallback(
    (currentPage: number, searchQuery: string) => {
      const nextPage = currentPage + 1;
      if (searchQuery) {
        pinsActions.searchForPins(searchQuery, nextPage);
      } else {
        pinsActions.loadPins(nextPage, false);
      }
      return nextPage;
    },
    [pinsActions.searchForPins, pinsActions.loadPins]
  );

  return {
    pins: pinsActions.pins,
    loading: pinsActions.loading,
    error: pinsActions.error,
    hasMore: pinsActions.hasMore,
    loadRandomPins: pinsActions.loadRandomPins,
    clearPins: pinsActions.clearPins,
    handleSearch,
    handleCategorySelect,
    handleTabChange,
    handleLoadMore,
  };
}
