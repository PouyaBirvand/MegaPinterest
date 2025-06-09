'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PinCard } from './PinCard';
import { Pin } from '@/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface MasonryGridProps {
  pins: Pin[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MasonryGrid({
  pins,
  loading,
  hasMore,
  onLoadMore,
}: MasonryGridProps) {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [columns, setColumns] = useState(4);
  const gridRef = useRef<HTMLDivElement>(null);

  
  const { lastElementRef } = useInfiniteScroll({
    hasMore: hasMore || false,
    loading: loading || false,
    onLoadMore: onLoadMore || (() => {}),
  });

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1280) setColumns(4);
      else setColumns(5);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);
  
  const uniquePins = useMemo(() => {
    const seen = new Set<string>();
    return pins.filter(pin => {
      if (seen.has(pin.id)) {
        console.warn(`Duplicate pin detected: ${pin.id}`);
        return false;
      }
      seen.add(pin.id);
      return true;
    });
  }, [pins]);

  return (
    <>
      <div
        ref={gridRef}
        className="container mx-auto px-4 py-6"
        style={{
          columnCount: columns,
          columnGap: '16px',
        }}
      >
        {uniquePins.map((pin, index) => (
          <div
            key={`pin-${pin.id}`} // اضافه کردن prefix
            ref={index === uniquePins.length - 1 ? lastElementRef : undefined}
            style={{ breakInside: 'avoid', marginBottom: '16px' }}
          >
            <PinCard pin={pin} onPinClick={setSelectedPin} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </>
  );
}
