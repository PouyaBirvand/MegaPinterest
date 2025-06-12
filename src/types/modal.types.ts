export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export interface ImageTransform {
  zoom: number;
  rotation: number;
  position: { x: number; y: number };
}
