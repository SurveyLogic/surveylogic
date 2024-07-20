import React, {forwardRef} from 'react';
import clsx from 'clsx';

type ScrollableListProps = {
  children: React.ReactNode;
  className?: string;
  gap?: string;
};

export const ScrollableView = forwardRef<HTMLDivElement, ScrollableListProps>(
  ({children, className, gap = 'gap-10'}, ref) => {
    const extendedChildren = React.Children.map(children, (child, i) => {
      if (React.isValidElement<ScrollableListItemProps>(child)) {
        return React.cloneElement<ScrollableListItemProps>(child, {
          isFirst: i === 0,
          isLast: React.Children.count(children) === i + 1,
        });
      }
      return child;
    });
    return (
      <div
        ref={ref}
        className={clsx(
          'tiny-scrollbar pb-4 overflow-x-auto relative flex items-center',
          gap,
          className
        )}
      >
        {extendedChildren}
      </div>
    );
  }
);

export type ScrollableListItemProps = {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
};
export function ScrollableViewItem({
  isFirst,
  isLast,
  children,
  className,
}: ScrollableListItemProps) {
  const mergedClass = clsx(className, 'flex-shrink-0', {
    'ml-auto': isFirst,
    'mr-auto': isLast,
  });
  return <div className={mergedClass}>{children}</div>;
}
