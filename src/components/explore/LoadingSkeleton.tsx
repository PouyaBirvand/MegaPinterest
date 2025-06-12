import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
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
