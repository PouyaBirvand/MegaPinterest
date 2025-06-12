export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'title' | 'mostLiked';
export type DateRange = 'all' | 'week' | 'month' | 'year';

export interface BoardPageState {
  searchQuery: string;
  sortBy: SortOption;
  viewMode: ViewMode;
  showFilters: boolean;
  selectedTags: string[];
  dateRange: DateRange;
}

export interface EditBoardState {
  showEditDialog: boolean;
  editTitle: string;
  editDescription: string;
  editIsPrivate: boolean;
  isUpdating: boolean;
}

export interface BoardPageProps {
  boardId: string;
}
