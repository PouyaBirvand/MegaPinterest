export interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface HomePageState {
  currentPage: number;
  activeCategory: string;
}

export interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  isLoading: boolean;
  onClick: (categoryId: string) => void;
}

export interface QuickActionButtonProps {
  variant: 'refresh' | 'popular';
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}
