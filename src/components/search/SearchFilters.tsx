'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SearchFiltersProps {
  filters: {
    orientation: string;
    color: string;
  };
  onFiltersChange: (filters: any) => void;
}

const colors = [
  { value: '', label: 'All colors' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'turquoise', label: 'Turquoise' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
  { value: 'gray', label: 'Gray' },
  { value: 'white', label: 'White' },
];

const orientations = [
  { value: 'all', label: 'All' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'square', label: 'Square' },
];

export function SearchFilters({
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const handleOrientationChange = (orientation: string) => {
    onFiltersChange({ ...filters, orientation });
  };

  const handleColorChange = (color: string) => {
    onFiltersChange({ ...filters, color });
  };

  const clearFilters = () => {
    onFiltersChange({ orientation: 'all', color: '' });
  };

  const hasActiveFilters =
    filters.orientation !== 'all' || filters.color !== '';

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Orientation:</span>
        <Select
          value={filters.orientation}
          onValueChange={handleOrientationChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {orientations.map(orientation => (
              <SelectItem key={orientation.value} value={orientation.value}>
                {orientation.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Color:</span>
        <Select value={filters.color} onValueChange={handleColorChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map(color => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center space-x-2">
                  {color.value && (
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.value }}
                    />
                  )}
                  <span>{color.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
