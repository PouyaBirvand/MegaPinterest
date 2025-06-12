import { FilterOption, SortOption } from '@/types/saved.types';

export const SORT_OPTIONS: Record<SortOption, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  title: 'Title A-Z',
  'most-liked': 'Most liked',
} as const;

export const FILTER_OPTIONS: Record<FilterOption, string> = {
  all: 'All time',
  today: 'Today',
  week: 'This week',
  month: 'This month',
  year: 'This year',
} as const;

export const MAX_VISIBLE_TAGS = 10;
