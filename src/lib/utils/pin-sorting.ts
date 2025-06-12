import { Pin } from '@/types';

export type SortType = 'popular' | 'recent' | 'relevant';

// محاسبه relevance برای pin
export function calculateRelevance(pin: Pin, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  if (pin.title.toLowerCase().includes(queryLower)) score += 10;
  if (pin.description?.toLowerCase().includes(queryLower)) score += 5;
  if (pin.tags?.some(tag => tag.toLowerCase().includes(queryLower))) score += 3;

  return score;
}

// Sort functions
export const sortByPopular = (pins: Pin[]): Pin[] => {
  return [...pins].sort((a, b) => (b.likes || 0) - (a.likes || 0));
};

export const sortByRecent = (pins: Pin[]): Pin[] => {
  return [...pins].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const sortByRelevant = (pins: Pin[], query?: string): Pin[] => {
  if (!query) {
    return [...pins].sort((a, b) => (b.saves || 0) - (a.saves || 0));
  }

  return [...pins].sort((a, b) => {
    const aRelevance = calculateRelevance(a, query);
    const bRelevance = calculateRelevance(b, query);
    return bRelevance - aRelevance;
  });
};

// Main sorting function
export function sortPins(
  pins: Pin[],
  sortType: SortType,
  query?: string
): Pin[] {
  if (!pins.length) return pins;

  switch (sortType) {
    case 'popular':
      return sortByPopular(pins);
    case 'recent':
      return sortByRecent(pins);
    case 'relevant':
      return sortByRelevant(pins, query);
    default:
      return sortByPopular(pins);
  }
}
