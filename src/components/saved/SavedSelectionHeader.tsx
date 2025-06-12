import { Checkbox } from '@/components/ui/checkbox';

interface SavedSelectionHeaderProps {
  isVisible: boolean;
  isAllSelected: boolean;
  totalCount: number;
  onSelectAll: () => void;
}

export function SavedSelectionHeader({
  isVisible,
  isAllSelected,
  totalCount,
  onSelectAll,
}: SavedSelectionHeaderProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
      <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
      <span className="text-sm font-medium">
        Select all ({totalCount} pins)
      </span>
    </div>
  );
}
