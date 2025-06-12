import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Sparkles, Music } from 'lucide-react';

interface FilterControlsProps {
  activeTab: string;
  sortBy: string;
  onTabChange: (tab: string) => void;
  onSortChange: (sortBy: string) => void;
}

export function FilterControls({
  activeTab,
  sortBy,
  onTabChange,
  onSortChange,
}: FilterControlsProps) {
  return (
    <section className="container mx-auto px-4 py-4 border-b">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
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
            <TabsTrigger value="recent" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={onSortChange}>
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
  );
}
