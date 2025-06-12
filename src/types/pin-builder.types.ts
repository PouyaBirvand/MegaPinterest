export interface PinFormData {
  title: string;
  description: string;
  link: string;
  altText: string;
  tags: string[];
  allowComments: boolean;
  isPublic: boolean;
}

export interface ImageData {
  file: File | null;
  preview: string;
  url: string;
}

export interface PinBuilderState {
  imageData: ImageData;
  formData: PinFormData;
  selectedBoardId: string;
  tagInput: string;
  dragActive: boolean;
  isLoading: boolean;
}
