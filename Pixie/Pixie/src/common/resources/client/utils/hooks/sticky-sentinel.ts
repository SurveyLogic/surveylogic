import {useCallback, useRef, useState} from 'react';

export function useStickySentinel() {
  const [isSticky, setIsSticky] = useState(false);

  const observerRef = useRef<IntersectionObserver>();

  const sentinelRef = useCallback((sentinel: HTMLDivElement | null) => {
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([e]) => setIsSticky(e.intersectionRatio < 1),
        {threshold: [1]}
      );
      observerRef.current = observer;
      observer.observe(sentinel);
    } else if (observerRef.current) {
      observerRef.current?.disconnect();
    }
  }, []);

  return {isSticky, sentinelRef};
}
