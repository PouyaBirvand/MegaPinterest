import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MAX_VISIBLE_TAGS } from '@/lib/constants/saved.constants';

interface SavedPageTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

export function SavedTags({ tags, onTagClick }: SavedPageTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4" />
        <span className="text-sm font-medium">Filter by tags:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, MAX_VISIBLE_TAGS).map(tag => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
