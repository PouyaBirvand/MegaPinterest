'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Board, Pin } from '@/types';

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type BoardsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_BOARDS'; payload: Board[] }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'SET_CURRENT_BOARD'; payload: Board | null }
  | { type: 'ADD_PIN_TO_BOARD'; payload: { boardId: string; pin: Pin } }
  | { type: 'REMOVE_PIN_FROM_BOARD'; payload: { boardId: string; pinId: string } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
  initialized: false,
};

function boardsReducer(state: BoardsState, action: BoardsAction): BoardsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    case 'ADD_BOARD':
      const newBoards = [...state.boards, action.payload];
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('boards', JSON.stringify(newBoards));
      }
      return { ...state, boards: newBoards };
    case 'UPDATE_BOARD':
      const updatedBoards = state.boards.map(board =>
        board.id === action.payload.id ? action.payload : board
      );
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('boards', JSON.stringify(updatedBoards));
      }
      return { ...state, boards: updatedBoards };
    case 'DELETE_BOARD':
      console.log('Deleting board with ID:', action.payload);
      const boardToDelete = state.boards.find(board => board.id === action.payload);
      if (boardToDelete) {
        console.log('Found board to delete:', boardToDelete.title);
      } else {
        console.log('Board not found in state');
        return state;
      }
      const filteredBoards = state.boards.filter(board => board.id !== action.payload);
      console.log('Boards after filter:', filteredBoards.length);
      
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('boards', JSON.stringify(filteredBoards));
      }
      
      return { ...state, boards: filteredBoards };
    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoard: action.payload };
    case 'ADD_PIN_TO_BOARD':
      const boardsWithNewPin = state.boards.map(board =>
        board.id === action.payload.boardId
          ? { ...board, pins: [...board.pins, action.payload.pin] }
          : board
      );
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('boards', JSON.stringify(boardsWithNewPin));
      }
      return { ...state, boards: boardsWithNewPin };
    case 'REMOVE_PIN_FROM_BOARD':
      const boardsWithRemovedPin = state.boards.map(board =>
        board.id === action.payload.boardId
          ? {
            ...board,
            pins: board.pins.filter(pin => pin.id !== action.payload.pinId),
          }
          : board
      );
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('boards', JSON.stringify(boardsWithRemovedPin));
      }
      return { ...state, boards: boardsWithRemovedPin };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    default:
      return state;
  }
}

const BoardsContext = createContext<{
  state: BoardsState;
  dispatch: React.Dispatch<BoardsAction>;
} | null>(null);

export function BoardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardsReducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined' && !state.initialized) {
      try {
        const savedBoards = localStorage.getItem('boards');
        if (savedBoards) {
          const boards = JSON.parse(savedBoards);
          dispatch({ type: 'SET_BOARDS', payload: boards });
        }
      } catch (error) {
        console.error('Error loading boards from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load boards' });
      } finally {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    }
  }, [state.initialized]);

  return (
    <BoardsContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardsProvider');
  }
  return context;
}

// Custom hooks for common operations
export function useBoardsActions() {
  const { dispatch, state } = useBoards();

  const createBoard = (board: Omit<Board, 'id' | 'createdAt'>) => {
    const newBoard: Board = {
      ...board,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOARD', payload: newBoard });
    return newBoard;
  };

  const updateBoard = (board: Board) => {
    dispatch({ type: 'UPDATE_BOARD', payload: board });
  };

  const deleteBoard = (boardId: string) => {
    console.log('deleteBoard function called with ID:', boardId);
    
    const currentBoards = state.boards;
    console.log('Current boards count:', currentBoards.length);
    console.log('Looking for board with ID:', boardId);
    
    const boardExists = currentBoards.find(board => board.id === boardId);
    if (!boardExists) {
      console.error('Board not found in current state');
      return;
    }
    
    console.log('Board found, proceeding with deletion:', boardExists.title);
    
    dispatch({ type: 'DELETE_BOARD', payload: boardId });
    
    console.log('DELETE_BOARD action dispatched');
  };

  const addPinToBoard = (boardId: string, pin: Pin) => {
    dispatch({ type: 'ADD_PIN_TO_BOARD', payload: { boardId, pin } });
  };

  const removePinFromBoard = (boardId: string, pinId: string) => {
    dispatch({ type: 'REMOVE_PIN_FROM_BOARD', payload: { boardId, pinId } });
  };

  return {
    createBoard,
    updateBoard,
    deleteBoard,
    addPinToBoard,
    removePinFromBoard,
  };
}
