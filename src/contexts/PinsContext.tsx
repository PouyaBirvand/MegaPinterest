'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Pin, SearchFilters } from '@/types';

interface PinsState {
  pins: Pin[];
  savedPins: Pin[];
  likedPins: Pin[];
  loading: boolean;
  error: string | null;
  searchFilters: SearchFilters;
  hasMore: boolean;
  initialized: boolean; // اضافه شد
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
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_SAVED_PINS'; payload: Pin[] } // اضافه شد
  | { type: 'SET_INITIALIZED'; payload: boolean }; // اضافه شد

const initialState: PinsState = {
  pins: [],
  savedPins: [],
  likedPins: [],
  loading: false,
  error: null,
  searchFilters: { query: '' },
  hasMore: true,
  initialized: false, // اضافه شد
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
      // بررسی تکراری نبودن
      const isAlreadySaved = state.savedPins.some(pin => pin.id === action.payload.id);
      if (isAlreadySaved) {
        return state;
      }
      
      const newSavedPins = [...state.savedPins, action.payload];
      
      // ذخیره در localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedPins', JSON.stringify(newSavedPins));
      }
      
      return { ...state, savedPins: newSavedPins };
      
    case 'UNSAVE_PIN':
      const filteredSavedPins = state.savedPins.filter(pin => pin.id !== action.payload);
      
      // ذخیره در localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedPins', JSON.stringify(filteredSavedPins));
      }
      
      return { ...state, savedPins: filteredSavedPins };
      
    case 'SET_SAVED_PINS':
      return { ...state, savedPins: action.payload };
      
    case 'LIKE_PIN':
      const newLikedPins = [
        ...state.likedPins.filter(id => id !== action.payload),
        action.payload,
      ];
      
      // ذخیره در localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedPins', JSON.stringify(newLikedPins));
      }
      
      return { ...state, likedPins: newLikedPins };
      
    case 'UNLIKE_PIN':
      const filteredLikedPins = state.likedPins.filter(id => id !== action.payload);
      
      // ذخیره در localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedPins', JSON.stringify(filteredLikedPins));
      }
      
      return { ...state, likedPins: filteredLikedPins };
      
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
      
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
      
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

  // بارگذاری داده‌ها از localStorage هنگام mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !state.initialized) {
      try {
        // بارگذاری saved pins
        const savedPinsData = localStorage.getItem('savedPins');
        if (savedPinsData) {
          const savedPins = JSON.parse(savedPinsData);
          dispatch({ type: 'SET_SAVED_PINS', payload: savedPins });
        }

        // بارگذاری liked pins
        const likedPinsData = localStorage.getItem('likedPins');
        if (likedPinsData) {
          const likedPins = JSON.parse(likedPinsData);
          dispatch({ type: 'SET_LIKED_PINS', payload: likedPins });
        }
      } catch (error) {
        console.error('Error loading pins from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved pins' });
      } finally {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    }
  }, [state.initialized]);

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

// Custom hooks برای عملیات رایج
export function usePinsActions() {
  const { dispatch } = usePins();

  const savePin = (pin: Pin) => {
    dispatch({ type: 'SAVE_PIN', payload: pin });
  };

  const unsavePin = (pinId: string) => {
    dispatch({ type: 'UNSAVE_PIN', payload: pinId });
  };

  const likePin = (pinId: string) => {
    dispatch({ type: 'LIKE_PIN', payload: pinId });
  };

  const unlikePin = (pinId: string) => {
    dispatch({ type: 'UNLIKE_PIN', payload: pinId });
  };

  const toggleSavePin = (pin: Pin, isSaved: boolean) => {
    if (isSaved) {
      unsavePin(pin.id);
    } else {
      savePin(pin);
    }
  };

  return {
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    toggleSavePin,
  };
}
