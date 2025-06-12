'use client';

import { PinFormData } from '@/types/pin-builder.types';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import LinkField from './LinkField';
import AltTextField from './AltTextField';
import TagsField from './TagsField';
import BoardSelection from './BoardSelection';
import PinSettings from './PinSettings';
import ActionButtons from './ActionButtons';
interface Board {
  id: string;
  title: string;
}

interface PinFormSectionProps {
  formData: PinFormData;
  tagInput: string;
  selectedBoardId: string;
  boards: Board[];
  isLoading: boolean;
  canSave: boolean;
  onUpdateField: <K extends keyof PinFormData>(
    field: K,
    value: PinFormData[K]
  ) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyPress: (e: React.KeyboardEvent) => void;
  onBoardChange: (boardId: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PinFormSection({
  formData,
  tagInput,
  selectedBoardId,
  boards,
  isLoading,
  canSave,
  onUpdateField,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagKeyPress,
  onBoardChange,
  onSave,
  onCancel,
}: PinFormSectionProps) {
  return (
    <div className="space-y-6">
      <TitleField
        value={formData.title}
        onChange={value => onUpdateField('title', value)}
      />

      <DescriptionField
        value={formData.description}
        onChange={value => onUpdateField('description', value)}
      />

      <LinkField
        value={formData.link}
        onChange={value => onUpdateField('link', value)}
      />

      <AltTextField
        value={formData.altText}
        onChange={value => onUpdateField('altText', value)}
      />

      <TagsField
        tags={formData.tags}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onKeyPress={onTagKeyPress}
      />

      <BoardSelection
        selectedBoardId={selectedBoardId}
        boards={boards}
        onBoardChange={onBoardChange}
      />

      <PinSettings
        allowComments={formData.allowComments}
        isPublic={formData.isPublic}
        onAllowCommentsChange={value => onUpdateField('allowComments', value)}
        onIsPublicChange={value => onUpdateField('isPublic', value)}
      />

      <ActionButtons
        isLoading={isLoading}
        canSave={canSave}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}
