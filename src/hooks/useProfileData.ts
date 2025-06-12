import { useMemo } from 'react';
import { useBoards } from '@/contexts/BoardsContext';
import { usePins } from '@/contexts/PinsContext';
import type { UserStats } from '@/types/profile.types';

export const useProfileData = () => {
  const { state: boardsState } = useBoards();
  const { state: pinsState } = usePins();

  const userStats: UserStats = useMemo(
    () => ({
      boards: boardsState.boards.length,
      pins: pinsState.savedPins.length,
      followers: Math.floor(Math.random() * 1000), // TODO: Replace with real data
      following: Math.floor(Math.random() * 500), // TODO: Replace with real data
    }),
    [boardsState.boards.length, pinsState.savedPins.length]
  );

  return {
    boards: boardsState.boards,
    savedPins: pinsState.savedPins,
    userStats,
  };
};
