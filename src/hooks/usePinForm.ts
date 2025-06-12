'use client';

import { useState, useCallback } from 'react';
import { PinFormData } from '@/types/pin-builder.types';

const initialFormData: PinFormData = {
  title: '',
  description: '',
  link: '',
  altText: '',
  tags: [],
  allowComments: true,
  isPublic: true,
};

export function usePinForm() {
  const [formData, setFormData] = useState<PinFormData>(initialFormData);
  const [tagInput, setTagInput] = useState('');

  const updateField = useCallback(
    <K extends keyof PinFormData>(field: K, value: PinFormData[K]) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const addTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  const validateForm = useCallback(
    (imagePreview: string): boolean => {
      return !!(imagePreview && formData.title.trim());
    },
    [formData.title]
  );

  return {
    formData,
    tagInput,
    setTagInput,
    updateField,
    addTag,
    removeTag,
    validateForm,
  };
}
