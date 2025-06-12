export type ViewMode = 'grid' | 'list';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title'
  | 'mostLiked'
  | 'alphabetical'
  | 'mostPins';

export type FilterOption = 'all' | 'private' | 'public' | 'empty' | 'recent';

export interface BoardsPageState {
  searchQuery: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  viewMode: ViewMode;
  showFilters: boolean;
  selectedBoards: string[];
}

export interface DialogStates {
  showCreateDialog: boolean;
  showEditDialog: boolean;
  editingBoard: Board | null;
}

export interface FormStates {
  newBoardTitle: string;
  newBoardDescription: string;
  isPrivate: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  editTitle: string;
  editDescription: string;
  editIsPrivate: boolean;
}
