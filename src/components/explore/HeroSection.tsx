import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { TRENDING_SEARCHES } from '@/lib/constants/explore.constants';

interface HeroSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearch }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore ideas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover millions of ideas for your next project
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for ideas..."
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full border-2"
            />
          </div>
        </div>

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
                onClick={() => onSearch(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
