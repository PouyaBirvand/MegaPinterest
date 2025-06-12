import {
  ChefHat,
  Home,
  Palette,
  Shirt,
  Camera,
  Heart,
  Mountain,
  Car,
} from 'lucide-react';
import { Category } from '@/types/explore.types';
import { SearchFilters } from '@/types/explore.types';

export const TRENDING_SEARCHES = [
  'aesthetic wallpaper',
  'home decor',
  'recipe ideas',
  'fashion outfits',
  'art inspiration',
  'travel destinations',
  'wedding ideas',
  'diy projects',
  'garden design',
  'photography',
] as const;

export const CATEGORIES: Category[] = [
  {
    name: 'Food & Drink',
    icon: ChefHat,
    color:
      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  },
  {
    name: 'Home Decor',
    icon: Home,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    name: 'Fashion',
    icon: Shirt,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  },
  {
    name: 'Art',
    icon: Palette,
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    name: 'Photography',
    icon: Camera,
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  {
    name: 'Travel',
    icon: Mountain,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  },
  {
    name: 'Lifestyle',
    icon: Heart,
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  {
    name: 'Automotive',
    icon: Car,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
];

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: '',
  sortBy: 'popular',
  activeTab: 'all',
};
