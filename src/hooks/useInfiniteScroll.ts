import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  fetchMore,
  hasMore,
  isLoading,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
        setIsFetching(true);
        fetchMore().finally(() => setIsFetching(false));
      }
    },
    [fetchMore, hasMore, isLoading, isFetching]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const options = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return { loadMoreRef, isFetching };
};
