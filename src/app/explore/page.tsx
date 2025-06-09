'use client';

import { useEffect, useState, useMemo } from 'react';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePinsActions } from '@/hooks/usePinsActions';
import { Pin } from '@/types';
import {
  Search,
  TrendingUp,
  ChefHat,
  Home,
  Palette,
  Shirt,
  Camera,
  Heart,
  Sparkles,
  Mountain,
  Car,
  Music,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TRENDING_SEARCHES = [
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
];

const CATEGORIES = [
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

export default function ExplorePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    pins,
    loading,
    error,
    hasMore,
    loadPins,
    searchForPins,
    loadRandomPins,
    clearPins
  } = usePinsActions();

  // Sort pins based on selected option
  const sortedPins = useMemo(() => {
    if (!pins.length) return pins;

    const pinsCopy = [...pins];

    switch (sortBy) {
      case 'popular':
        return pinsCopy.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'recent':
        return pinsCopy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'relevant':
        // اگر search query داریم، بر اساس relevance sort کنیم
        if (searchQuery) {
          return pinsCopy.sort((a, b) => {
            const aRelevance = calculateRelevance(a, searchQuery);
            const bRelevance = calculateRelevance(b, searchQuery);
            return bRelevance - aRelevance;
          });
        }
        return pinsCopy.sort((a, b) => (b.saves || 0) - (a.saves || 0));
      default:
        return pinsCopy;
    }
  }, [pins, sortBy, searchQuery]);

  // محاسبه relevance برای sorting
  const calculateRelevance = (pin: Pin, query: string): number => {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Title match
    if (pin.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description match
    if (pin.description?.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Tags match
    if (pin.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
      score += 3;
    }

    return score;
  };

  useEffect(() => {
    if (!isInitialized) {
      clearPins(); // پاک کردن state قبلی
      loadRandomPins();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedCategory(''); // پاک کردن category
    clearPins(); // پاک کردن pins قبلی
    
    if (query.trim()) {
      searchForPins(query.trim(), 1);
    } else {
      loadRandomPins();
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery(''); 
    clearPins();
    searchForPins(category, 1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (searchQuery) {
      searchForPins(searchQuery, nextPage);
    } else {
      loadPins(nextPage, false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCategory('');
    clearPins();
    
    switch (tab) {
      case 'trending':
        loadRandomPins();
        break;
      case 'recent':
        loadPins(1, true);
        break;
      default:
        loadRandomPins();
    }
  };

  useEffect(() => {
    return () => {
      clearPins();
    };
  }, []);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => loadRandomPins()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore ideas
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover millions of ideas for your next project
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for ideas..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="pl-12 h-14 text-lg rounded-full border-2"
              />
            </div>
          </div>

          {/* Trending Searches */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Trending searches
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TRENDING_SEARCHES.map(search => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                  onClick={() => handleSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {CATEGORIES.map(category => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.name}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform ${
                  selectedCategory === category.name ? category.color : ''
                }`}
                onClick={() => handleCategorySelect(category.name)}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-xs font-medium text-center">
                  {category.name}
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 py-4 border-b">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="flex items-center space-x-2"
              >
                <Music className="h-4 w-4" />
                <span>Recent</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort Control */}
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="relevant">Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8">
        {selectedCategory && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedCategory} ideas</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('');
                  loadRandomPins();
                }}
              >
                Clear filter
              </Button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {sortedPins.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {sortedPins.length} pins found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <p className="text-sm text-muted-foreground">Sorted by {sortBy}</p>
          </div>
        )}

        {sortedPins.length > 0 ? (
          <MasonryGrid
            pins={sortedPins}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <EmptyState onRetry={() => loadRandomPins()} />
        )}
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-4">
          <Skeleton
            className="w-full rounded-2xl"
            style={{ height: `${Math.random() * 200 + 200}px` }}
          />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">No results found</h2>
        <p className="text-muted-foreground mb-6">
          Try searching for something else or browse our trending ideas.
        </p>
        <Button onClick={onRetry}>
          <Sparkles className="h-4 w-4 mr-2" />
          Explore trending
        </Button>
      </div>
    </div>
  );
}
