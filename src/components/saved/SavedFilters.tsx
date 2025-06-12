import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Saved_Filters, SortOption, FilterOption } from '@/types/saved.types';
import { SORT_OPTIONS, FILTER_OPTIONS } from '@/lib/constants/saved.constants';

interface SavedPageFiltersProps {
  filters: Saved_Filters;
  onUpdateFilter: <K extends keyof Saved_Filters>(
    key: K,
    value: Saved_Filters[K]
  ) => void;
}

export function SavedFilters({
  filters,
  onUpdateFilter,
}: SavedPageFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search saved pins..."
          value={filters.searchQuery}
          onChange={e => onUpdateFilter('searchQuery', e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.sortBy}
        onValueChange={(value: SortOption) => onUpdateFilter('sortBy', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.filterBy}
        onValueChange={(value: FilterOption) =>
          onUpdateFilter('filterBy', value)
        }
      >
        <SelectTrigger className="w-[150px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(FILTER_OPTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
