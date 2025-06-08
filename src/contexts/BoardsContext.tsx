'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Board, Pin } from '@/types';

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
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
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

function boardsReducer(state: BoardsState, action: BoardsAction): BoardsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    case 'ADD_BOARD':
      return { ...state, boards: [...state.boards, action.payload] };
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.id ? action.payload : board
        ),
      };
    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board.id !== action.payload),
      };
    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoard: action.payload };
    case 'ADD_PIN_TO_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, pins: [...board.pins, action.payload.pin] }
            : board
        ),
      };
    case 'REMOVE_PIN_FROM_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, pins: board.pins.filter(pin => pin.id !== action.payload.pinId) }
            : board
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
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
