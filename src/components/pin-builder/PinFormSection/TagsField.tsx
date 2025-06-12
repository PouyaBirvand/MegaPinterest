import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export default function TagsField({
  tags,
  tagInput,
  onTagInputChange,
  onRemoveTag,
  onKeyPress,
}: {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <Label className="text-base font-semibold">Tags</Label>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <div
              key={tag}
              className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Input
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={e => onTagInputChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
}
