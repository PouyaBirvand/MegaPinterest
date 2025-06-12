import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function FileUploadArea({
  dragActive,
  fileInputRef,
  onDrag,
  onDrop,
  onFileInput,
}: {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-2">
        Drag and drop or click to upload
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Recommendation: Use high-quality .jpg files less than 20MB
      </p>
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        Select from computer
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
      />
    </div>
  );
}
