import {ReactNode} from 'react';
import clsx from 'clsx';

interface SectionHelperProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  color?: 'positive' | 'danger' | 'warning' | 'primary' | 'neutral';
  className?: string;
}
export function SectionHelper({
  title,
  description,
  actions,
  color = 'primary',
  className,
}: SectionHelperProps) {
  return (
    <div
      className={clsx(
        className,
        'p-10 rounded',
        color === 'positive' &&
          'bg-positive/focus border-l-positive border-l-4',
        color === 'warning' && 'bg-warning/focus border-l-warning border-l-4',
        color === 'danger' && 'bg-danger/focus border-l-danger border-l-4',
        color === 'primary' && 'bg-primary/focus border-l-primary border-l-4',
        color === 'neutral' && 'bg-paper border'
      )}
    >
      {title && <div className="text-sm mb-4 font-medium">{title}</div>}
      {description && <div className="text-sm">{description}</div>}
      {actions && <div className="mt-14">{actions}</div>}
    </div>
  );
}
