import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function ImagePreview({
  preview,
  onClear,
}: {
  preview: string;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
        <Image src={preview} alt="Preview" fill className="object-cover" />
      </div>
      <Button
        size="icon"
        className="absolute top-2 right-2 bg-white/30 hover:bg-white"
        onClick={onClear}
      >
        <X className="h-4 w-4 text-black" />
      </Button>
    </div>
  );
}
