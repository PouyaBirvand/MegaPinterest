import { Pin } from '.';

export interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'popular' | 'recent' | 'relevant';
  activeTab: 'all' | 'trending' | 'recent';
}

export interface ExplorePageProps {
  initialPins?: Pin[];
  initialFilters?: Partial<SearchFilters>;
}

export interface PinSortStrategy {
  sort(pins: Pin[], query?: string): Pin[];
}
