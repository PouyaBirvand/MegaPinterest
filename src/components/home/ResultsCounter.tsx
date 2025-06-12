import React from 'react';

interface ResultsCounterProps {
  count: number;
  activeCategory?: string;
}

export function ResultsCounter({ count, activeCategory }: ResultsCounterProps) {
  if (count === 0) return null;

  return (
    <section className="container mx-auto px-4 pb-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {count} pins found
          {activeCategory && ` for "${activeCategory}"`}
        </p>
      </div>
    </section>
  );
}
