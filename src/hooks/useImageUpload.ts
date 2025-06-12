'use client';

import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { ImageData } from '@/types/pin-builder.types';

export function useImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageData, setImageData] = useState<ImageData>({
    file: null,
    preview: '',
    url: '',
  });

  const validateImageFile = useCallback((file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      toast.error('File size must be less than 20MB');
      return false;
    }

    return true;
  }, []);

  const processImageFile = useCallback(
    (file: File) => {
      if (!validateImageFile(file)) return;

      const reader = new FileReader();
      reader.onload = e => {
        const preview = e.target?.result as string;
        setImageData(prev => ({
          ...prev,
          file,
          preview,
        }));
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    },
    [validateImageFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files?.[0]) {
        processImageFile(files[0]);
      }
    },
    [processImageFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.[0]) {
        processImageFile(files[0]);
      }
    },
    [processImageFile]
  );

  const handleUrlLoad = useCallback(() => {
    if (!imageData.url) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setImageData(prev => ({
      ...prev,
      preview: prev.url,
    }));
  }, [imageData.url]);

  const clearImage = useCallback(() => {
    setImageData({
      file: null,
      preview: '',
      url: '',
    });
  }, []);

  const updateImageUrl = useCallback((url: string) => {
    setImageData(prev => ({
      ...prev,
      url,
    }));
  }, []);

  return {
    fileInputRef,
    dragActive,
    imageData,
    handleDrag,
    handleDrop,
    handleFileInput,
    handleUrlLoad,
    clearImage,
    updateImageUrl,
  };
}
