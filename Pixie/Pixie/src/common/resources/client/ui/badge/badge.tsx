import {cloneElement, forwardRef, ReactElement, ReactNode} from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactElement;
  // don't override child props, as child props are passed through
  badgeLabel?: ReactNode;
  badgeClassName?: string;
  withBorder?: boolean;
  badgeIsVisible?: boolean;
}
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      children,
      badgeLabel,
      badgeClassName,
      withBorder = true,
      badgeIsVisible = true,
      ...childProps
    },
    ref
  ) => {
    return (
      <div className={clsx('relative', badgeClassName)}>
        {cloneElement(children, {...childProps, ref})}
        {badgeIsVisible && (
          <div
            className={clsx(
              'absolute top-2 right-4 bg-warning text-white text-xs font-bold whitespace-nowrap rounded-full flex items-center justify-center shadow',
              withBorder && 'border-2 border-white',
              badgeLabel ? 'w-18 h-18' : 'w-12 h-12'
            )}
          >
            {badgeLabel}
          </div>
        )}
      </div>
    );
  }
);
