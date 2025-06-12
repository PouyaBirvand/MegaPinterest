import { useMemo } from 'react';
import { Pin } from '@/types';
import { SortType, sortPins } from '@/lib/utils/pin-sorting';

interface UsePinSortingProps {
  pins: Pin[];
  sortType: SortType;
  searchQuery?: string;
}

export function usePinSorting({
  pins,
  sortType,
  searchQuery,
}: UsePinSortingProps) {
  const sortedPins = useMemo(() => {
    // جلوگیری از sorting اگر pins خالی است
    if (!pins || pins.length === 0) return [];

    return sortPins(pins, sortType, searchQuery);
  }, [pins, sortType, searchQuery]);

  const totalCount = useMemo(() => sortedPins.length, [sortedPins.length]);

  return {
    sortedPins,
    totalCount,
  };
}
