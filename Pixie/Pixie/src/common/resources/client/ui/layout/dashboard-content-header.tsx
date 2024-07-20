import {ReactNode} from 'react';
import clsx from 'clsx';

interface DashboardContentHeaderProps {
  children: ReactNode;
  className?: string;
}
export function DashboardContentHeader({
  children,
  className,
}: DashboardContentHeaderProps) {
  return (
    <div className={clsx(className, 'dashboard-grid-header')}>{children}</div>
  );
}
