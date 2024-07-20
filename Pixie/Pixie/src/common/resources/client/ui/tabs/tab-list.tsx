import React, {Children, cloneElement, isValidElement, ReactNode} from 'react';
import clsx from 'clsx';
import {FocusScope} from '@react-aria/focus';
import {TabProps} from './tab';
import {TabLine} from './tab-line';

export interface TabListProps {
  children: ReactNode;
  // center tabs within tablist
  center?: boolean;
  // expand tabs to fill in tablist space fully. By default, tabs are only as wide as their content.
  expand?: boolean;
  className?: string;
}
export function TabList({children, center, expand, className}: TabListProps) {
  const childrenArray = Children.toArray(children);

  return (
    <FocusScope>
      <div
        className={clsx(
          // hide scrollbar completely on mobile, show compact one on desktop
          'flex relative max-w-full overflow-auto border-b max-sm:hidden-scrollbar md:compact-scrollbar',
          className
        )}
        role="tablist"
        aria-orientation="horizontal"
      >
        {childrenArray.map((child, index) => {
          if (isValidElement<TabProps>(child)) {
            return cloneElement<TabProps>(child, {
              index,
              className: clsx(
                child.props.className,
                expand && 'flex-auto',
                center && index === 0 && 'ml-auto',
                center && index === childrenArray.length - 1 && 'mr-auto'
              ),
            });
          }
          return null;
        })}
        <TabLine />
      </div>
    </FocusScope>
  );
}
