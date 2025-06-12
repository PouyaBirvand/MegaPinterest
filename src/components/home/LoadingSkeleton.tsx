import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LOADING_SKELETON_COUNT } from '@/lib/constants/categories.constants';

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {Array.from({ length: LOADING_SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <Skeleton
              className="w-full rounded-2xl"
              style={{ height: `${Math.random() * 200 + 200}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
