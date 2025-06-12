'use client';

import { ImageUploadSection } from '@/components/pin-builder/ImageUploadSection';
import { PinBuilderHeader } from '@/components/pin-builder/PinBuilderHeader';
import { PinFormSection } from '@/components/pin-builder/PinFormSection';
import { Label } from '@/components/ui/label';
import { useImageUpload } from '@/hooks/useImageUpload';
import { usePinBuilder } from '@/hooks/usePinBuilder';
import { usePinForm } from '@/hooks/usePinForm';

export default function PinBuilderPage() {
  // Custom hooks for separation of concerns
  const imageUpload = useImageUpload();
  const pinForm = usePinForm();
  const pinBuilder = usePinBuilder();

  // Event handlers
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      pinForm.addTag();
    }
  };

  const handleSave = () => {
    pinBuilder.savePin(pinForm.formData, imageUpload.imageData);
  };

  const canSave = pinForm.validateForm(imageUpload.imageData.preview);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PinBuilderHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Add Image</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image or add a URL
            </p>

            <ImageUploadSection
              imageData={imageUpload.imageData}
              dragActive={imageUpload.dragActive}
              fileInputRef={imageUpload.fileInputRef}
              onDrag={imageUpload.handleDrag}
              onDrop={imageUpload.handleDrop}
              onFileInput={imageUpload.handleFileInput}
              onUrlLoad={imageUpload.handleUrlLoad}
              onClearImage={imageUpload.clearImage}
              onUpdateImageUrl={imageUpload.updateImageUrl}
            />
          </div>
        </div>

        {/* Right Column - Pin Details */}
        <PinFormSection
          formData={pinForm.formData}
          tagInput={pinForm.tagInput}
          selectedBoardId={pinBuilder.selectedBoardId}
          boards={pinBuilder.boards}
          isLoading={pinBuilder.isLoading}
          canSave={canSave}
          onUpdateField={pinForm.updateField}
          onTagInputChange={pinForm.setTagInput}
          onAddTag={pinForm.addTag}
          onRemoveTag={pinForm.removeTag}
          onTagKeyPress={handleTagKeyPress}
          onBoardChange={pinBuilder.setSelectedBoardId}
          onSave={handleSave}
          onCancel={pinBuilder.handleCancel}
        />
      </div>
    </div>
  );
}
