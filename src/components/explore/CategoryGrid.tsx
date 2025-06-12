import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants/explore.constants';

interface CategoryGridProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryGrid({
  selectedCategory,
  onCategorySelect,
}: CategoryGridProps) {
  return (
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
              onClick={() => onCategorySelect(category.name)}
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
  );
}
