import {cloneElement, ReactElement} from 'react';
import clsx from 'clsx';

interface DashboardContentProps {
  children: ReactElement<{className: string}>;
}
export function DashboardContent({children}: DashboardContentProps) {
  return cloneElement(children, {
    className: clsx(
      children.props.className,
      'dashboard-grid-content overflow-y-auto'
    ),
  });
}
