import {ProgressCircle} from './progress-circle';
import React from 'react';
import clsx from 'clsx';

interface FullPageLoaderProps {
  className?: string;
}
export function FullPageLoader({className}: FullPageLoaderProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center h-full w-full flex-auto',
        className
      )}
    >
      <ProgressCircle isIndeterminate aria-label="Loading page..." />
    </div>
  );
}
