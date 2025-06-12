'use client';

import { useState, useCallback } from 'react';
import { Board } from '@/types';
import { DialogStates, FormStates } from '@/types/boards.types';

const initialDialogStates: DialogStates = {
  showCreateDialog: false,
  showEditDialog: false,
  editingBoard: null,
};

const initialFormStates: FormStates = {
  newBoardTitle: '',
  newBoardDescription: '',
  isPrivate: false,
  isCreating: false,
  isUpdating: false,
  editTitle: '',
  editDescription: '',
  editIsPrivate: false,
};

export function useBoardDialogs() {
  const [dialogStates, setDialogStates] =
    useState<DialogStates>(initialDialogStates);
  const [formStates, setFormStates] = useState<FormStates>(initialFormStates);

  const openCreateDialog = useCallback(() => {
    setDialogStates(prev => ({ ...prev, showCreateDialog: true }));
  }, []);

  const closeCreateDialog = useCallback(() => {
    setDialogStates(prev => ({ ...prev, showCreateDialog: false }));
    setFormStates(prev => ({
      ...prev,
      newBoardTitle: '',
      newBoardDescription: '',
      isPrivate: false,
    }));
  }, []);

  const openEditDialog = useCallback((board: Board) => {
    setDialogStates({
      showCreateDialog: false,
      showEditDialog: true,
      editingBoard: board,
    });
    setFormStates(prev => ({
      ...prev,
      editTitle: board.title,
      editDescription: board.description || '',
      editIsPrivate: board.isPrivate,
    }));
  }, []);

  const closeEditDialog = useCallback(() => {
    setDialogStates(prev => ({
      ...prev,
      showEditDialog: false,
      editingBoard: null,
    }));
  }, []);

  const updateFormField = useCallback((field: keyof FormStates, value: any) => {
    setFormStates(prev => ({ ...prev, [field]: value }));
  }, []);

  const setLoading = useCallback(
    (field: 'isCreating' | 'isUpdating', value: boolean) => {
      setFormStates(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    ...dialogStates,
    ...formStates,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    updateFormField,
    setLoading,
  };
}
