import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon } from 'lucide-react';

export default function UrlUploadArea({
  imageUrl,
  onUpdateImageUrl,
  onUrlLoad,
}: {
  imageUrl: string;
  onUpdateImageUrl: (url: string) => void;
  onUrlLoad: () => void;
}) {
  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <Input
          placeholder="Paste image URL here"
          value={imageUrl}
          onChange={e => onUpdateImageUrl(e.target.value)}
        />
      </div>
      <Button onClick={onUrlLoad} disabled={!imageUrl}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
