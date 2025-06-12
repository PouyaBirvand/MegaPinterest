export type SortOption = 'newest' | 'oldest' | 'title' | 'most-liked';
export type FilterOption = 'all' | 'today' | 'week' | 'month' | 'year';
export type ViewMode = 'grid' | 'list';

export interface Saved_Filters {
  searchQuery: string;
  sortBy: SortOption;
  filterBy: FilterOption;
}

export interface SavedSelection {
  selectedPins: string[];
  isSelectionMode: boolean;
}
