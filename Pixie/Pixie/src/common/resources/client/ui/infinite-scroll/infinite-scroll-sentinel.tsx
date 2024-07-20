import {AnimatePresence, m} from 'framer-motion';
import {ProgressCircle} from '../progress/progress-circle';
import React, {ReactNode, useEffect, useRef} from 'react';
import {opacityAnimation} from '../animation/opacity-animation';
import clsx from 'clsx';
import {UseInfiniteQueryResult} from '@tanstack/react-query/src/types';

export interface InfiniteScrollSentinelProps {
  loaderMarginTop?: string;
  children?: ReactNode;
  query: UseInfiniteQueryResult;
  style?: React.CSSProperties;
  className?: string;
}
export function InfiniteScrollSentinel({
  query: {isInitialLoading, fetchNextPage, isFetchingNextPage, hasNextPage},
  children,
  loaderMarginTop = 'mt-24',
  style,
  className,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isInitialLoading
      ) {
        fetchNextPage();
      }
    });
    observer.observe(sentinelEl);
    return () => {
      observer.unobserve(sentinelEl);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isInitialLoading]);

  // children might already be wrapped in AnimatePresence, so only wrap default loader with it
  const content = children ? (
    isFetchingNextPage ? (
      children
    ) : null
  ) : (
    <AnimatePresence>
      {isFetchingNextPage && (
        <m.div
          className={clsx('flex justify-center w-full', loaderMarginTop)}
          {...opacityAnimation}
        >
          <ProgressCircle isIndeterminate aria-label="loading" />
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      style={style}
      className={clsx('w-full', className)}
      role="presentation"
    >
      <div ref={sentinelRef} aria-hidden />
      {content}
    </div>
  );
}
