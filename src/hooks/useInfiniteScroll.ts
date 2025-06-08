import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 1000,
}: UseInfiniteScrollProps) {
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  // Alternative scroll-based approach
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - threshold &&
        hasMore &&
        !loading
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, onLoadMore, threshold]);

  return { lastElementRef };
}
