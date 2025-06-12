import { ChefHat, Home, Palette, Shirt } from 'lucide-react';
import { Category } from '@/types/home.types';

export const CATEGORIES: Category[] = [
  { id: 'home decor', label: 'Home decor', icon: Home },
  { id: 'recipes', label: 'Recipes', icon: ChefHat },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'art', label: 'Art', icon: Palette },
] as const;

export const INITIAL_PAGE = 1;
export const LOADING_SKELETON_COUNT = 20;
