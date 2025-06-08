'use client';

import { useEffect, useRef, useState } from 'react';
import { PinCard } from './PinCard';
import { PinModal } from './PinModal';
import { Pin } from '@/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface MasonryGridProps {
  pins: Pin[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MasonryGrid({ pins, loading, hasMore, onLoadMore }: MasonryGridProps) {
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

  // Distribute pins across columns
  const distributeColumns = () => {
    const columnArrays: Pin[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    pins.forEach((pin) => {
      // Find column with minimum height
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columnArrays[minHeightIndex].push(pin);
      
      // Estimate height (aspect ratio + padding)
      const estimatedHeight = (pin.imageHeight / pin.imageWidth) * 300 + 100;
      columnHeights[minHeightIndex] += estimatedHeight;
    });

    return columnArrays;
  };

  const columnArrays = distributeColumns();

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
        {pins.map((pin, index) => (
          <div
            key={pin.id}
            ref={index === pins.length - 1 ? lastElementRef : undefined}
            style={{ breakInside: 'avoid', marginBottom: '16px' }}
          >
            <PinCard
              pin={pin}
              onPinClick={setSelectedPin}
            />
          </div>
        ))}
      </div>

      {/* Alternative Grid Layout (Better for complex layouts) */}
      {/* <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-4 ${
          columns === 2 ? 'grid-cols-2' :
          columns === 3 ? 'grid-cols-3' :
          columns === 4 ? 'grid-cols-4' : 'grid-cols-5'
        }`}>
          {columnArrays.map((columnPins, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {columnPins.map((pin, pinIndex) => (
                <div
                  key={pin.id}
                  ref={
                    columnIndex === columnArrays.length - 1 && 
                    pinIndex === columnPins.length - 1 
                      ? lastElementRef 
                      : undefined
                  }
                >
                  <PinCard
                    pin={pin}
                    onPinClick={setSelectedPin}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Pin Modal */}
      <PinModal
        pin={selectedPin}
        open={!!selectedPin}
        onOpenChange={(open) => !open && setSelectedPin(null)}
      />
    </>
  );
}
