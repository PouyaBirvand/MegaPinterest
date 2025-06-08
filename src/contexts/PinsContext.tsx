'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pin, SearchFilters } from '@/types';

interface PinsState {
  pins: Pin[];
  savedPins: Pin[];
  likedPins: Pin[];
  loading: boolean;
  error: string | null;
  searchFilters: SearchFilters;
  hasMore: boolean;
}

type PinsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PINS'; payload: Pin[] }
  | { type: 'ADD_PINS'; payload: Pin[] }
  | { type: 'SAVE_PIN'; payload: Pin }
  | { type: 'UNSAVE_PIN'; payload: string }
  | { type: 'LIKE_PIN'; payload: string }
  | { type: 'UNLIKE_PIN'; payload: string }
  | { type: 'SET_SEARCH_FILTERS'; payload: SearchFilters }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HAS_MORE'; payload: boolean };

const initialState: PinsState = {
  pins: [],
  savedPins: [],
  likedPins: [],
  loading: false,
  error: null,
  searchFilters: { query: '' },
  hasMore: true,
};

function pinsReducer(state: PinsState, action: PinsAction): PinsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PINS':
      return { ...state, pins: action.payload };
    case 'ADD_PINS':
      return { ...state, pins: [...state.pins, ...action.payload] };
    case 'SAVE_PIN':
      return { ...state, savedPins: [...state.savedPins, action.payload] };
    case 'UNSAVE_PIN':
      return { 
        ...state, 
        savedPins: state.savedPins.filter(pin => pin.id !== action.payload) 
      };
    case 'LIKE_PIN':
      return { 
        ...state, 
        likedPins: [...state.likedPins.filter(id => id !== action.payload), action.payload] 
      };
    case 'UNLIKE_PIN':
      return { 
        ...state, 
        likedPins: state.likedPins.filter(id => id !== action.payload) 
      };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
}

const PinsContext = createContext<{
  state: PinsState;
  dispatch: React.Dispatch<PinsAction>;
} | null>(null);

export function PinsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pinsReducer, initialState);

  return (
    <PinsContext.Provider value={{ state, dispatch }}>
      {children}
    </PinsContext.Provider>
  );
}

export function usePins() {
  const context = useContext(PinsContext);
  if (!context) {
    throw new Error('usePins must be used within a PinsProvider');
  }
  return context;
}
