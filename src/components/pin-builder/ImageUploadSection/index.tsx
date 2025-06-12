'use client';

import { ImageData } from '@/types/pin-builder.types';
import ImagePreview from './ImagePreview';
import FileUploadArea from './FileUploadArea';
import UrlUploadArea from './UrlUploadArea';
interface ImageUploadSectionProps {
  imageData: ImageData;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlLoad: () => void;
  onClearImage: () => void;
  onUpdateImageUrl: (url: string) => void;
}

export function ImageUploadSection({
  imageData,
  dragActive,
  fileInputRef,
  onDrag,
  onDrop,
  onFileInput,
  onUrlLoad,
  onClearImage,
  onUpdateImageUrl,
}: ImageUploadSectionProps) {
  if (imageData.preview) {
    return <ImagePreview preview={imageData.preview} onClear={onClearImage} />;
  }

  return (
    <div className="space-y-4">
      <FileUploadArea
        dragActive={dragActive}
        fileInputRef={fileInputRef}
        onDrag={onDrag}
        onDrop={onDrop}
        onFileInput={onFileInput}
      />
      <UrlUploadArea
        imageUrl={imageData.url}
        onUpdateImageUrl={onUpdateImageUrl}
        onUrlLoad={onUrlLoad}
      />
    </div>
  );
}
