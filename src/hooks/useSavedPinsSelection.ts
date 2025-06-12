import { Pin } from '@/types';
import { SavedSelection } from '@/types/saved.types';
import { useState } from 'react';

export function useSavedPinsSelection() {
  const [selection, setSelection] = useState<SavedSelection>({
    selectedPins: [],
    isSelectionMode: false,
  });

  // Toggle selection mode and clear selections (exactly like original)
  const toggleSelectionMode = () => {
    setSelection(prev => ({
      selectedPins: [],
      isSelectionMode: !prev.isSelectionMode,
    }));
  };

  // Select all pins or deselect all (exactly like original logic)
  const selectAll = (pins: Pin[]) => {
    const allSelected =
      selection.selectedPins.length === pins.length && pins.length > 0;
    setSelection(prev => ({
      ...prev,
      selectedPins: allSelected ? [] : pins.map(pin => pin.id),
    }));
  };

  // Toggle individual pin selection (exactly like original)
  const togglePinSelection = (pinId: string) => {
    setSelection(prev => ({
      ...prev,
      selectedPins: prev.selectedPins.includes(pinId)
        ? prev.selectedPins.filter(id => id !== pinId)
        : [...prev.selectedPins, pinId],
    }));
  };

  const clearSelection = () => {
    setSelection(prev => ({
      ...prev,
      selectedPins: [],
    }));
  };

  return {
    selection,
    toggleSelectionMode,
    selectAll,
    togglePinSelection,
    clearSelection,
  };
}
