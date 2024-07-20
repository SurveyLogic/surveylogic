import {ReactNode, Ref} from 'react';
import clsx from 'clsx';

export interface ChartLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
  contentIsFlex?: boolean;
  contentClassName?: string;
  minHeight?: string;
  contentRef?: Ref<HTMLDivElement>;
  isLoading?: boolean;
}
export function ChartLayout(props: ChartLayoutProps) {
  const {
    title,
    description,
    children,
    className,
    contentIsFlex = true,
    contentClassName,
    contentRef,
    minHeight = 'min-h-440',
  } = props;

  return (
    <div
      className={clsx(
        'bg border rounded h-full flex flex-col flex-auto',
        minHeight,
        className
      )}
    >
      <div className="text-xs p-14 flex-shrink-0 flex justify-between items-center">
        <div className="font-semibold text-sm">{title}</div>
        {description && <div className="text-muted">{description}</div>}
      </div>
      <div
        ref={contentRef}
        className={clsx(
          'p-14 relative',
          contentIsFlex && 'flex-auto flex items-center justify-center',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
