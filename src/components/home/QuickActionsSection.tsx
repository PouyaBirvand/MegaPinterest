import React from 'react';
import { ActiveCategoryBadge } from './ActiveCategoryBadge';
import { QuickActionButton } from './QuickActionButton';
import { CategoryButton } from './CategoryButton';
import { CATEGORIES } from '@/lib/constants/categories.constants';

interface QuickActionsSectionProps {
  activeCategory: string;
  isLoading: boolean;
  onRefresh: () => void;
  onPopular: () => void;
  onCategoryClick: (category: string) => void;
  onClearCategory: () => void;
}

export function QuickActionsSection({
  activeCategory,
  isLoading,
  onRefresh,
  onPopular,
  onCategoryClick,
  onClearCategory,
}: QuickActionsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6">
      <ActiveCategoryBadge
        category={activeCategory}
        onClear={onClearCategory}
      />

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <QuickActionButton
          variant="refresh"
          isActive={!activeCategory} // فقط وقتی هیچ category انتخاب نشده
          isLoading={isLoading}
          onClick={onRefresh}
        />

        <QuickActionButton
          variant="popular"
          isActive={!activeCategory} // فقط وقتی هیچ category انتخاب نشده
          isLoading={isLoading}
          onClick={onPopular}
        />

        {CATEGORIES.map(category => (
          <CategoryButton
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            isLoading={isLoading}
            onClick={onCategoryClick}
          />
        ))}
      </div>
    </section>
  );
}
