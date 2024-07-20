import clsx from 'clsx';
import {m} from 'framer-motion';
import {cloneElement, ReactElement, useContext} from 'react';
import {DashboardLayoutContext} from './dashboard-layout-context';

export interface SidenavProps {
  className?: string;
  children: ReactElement<{className: string; isCompactMode?: boolean}>;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | string;
  mode?: 'overlay';
  // absolute will place sidenav between navbar/footer, fixed will overlay it over nav/footer.
  overlayPosition?: 'absolute' | 'fixed';
  display?: 'flex' | 'block';
  forceClosed?: boolean;
}
export function DashboardSidenav({
  className,
  position,
  children,
  size = 'md',
  mode,
  overlayPosition = 'fixed',
  display = 'flex',
  forceClosed = false,
}: SidenavProps) {
  const {
    isMobileMode,
    leftSidenavStatus,
    setLeftSidenavStatus,
    rightSidenavStatus,
    setRightSidenavStatus,
  } = useContext(DashboardLayoutContext);
  const status = position === 'left' ? leftSidenavStatus : rightSidenavStatus;
  const isOverlayMode = isMobileMode || mode === 'overlay';

  const variants = {
    open: {display, width: null as any},
    compact: {
      display,
      width: null as any,
    },
    closed: {
      width: 0,
      transitionEnd: {
        display: 'none',
      },
    },
  };

  const sizeClassName = getSize(status === 'compact' ? 'compact' : size);

  return (
    <m.div
      variants={variants}
      initial={false}
      animate={forceClosed ? 'closed' : status}
      transition={{type: 'tween', duration: 0.15}}
      onClick={e => {
        // close sidenav when user clicks a link or button on mobile
        const target = e.target as HTMLElement;
        if (isMobileMode && (target.closest('button') || target.closest('a'))) {
          setLeftSidenavStatus('closed');
          setRightSidenavStatus('closed');
        }
      }}
      className={clsx(
        className,
        position === 'left'
          ? 'dashboard-grid-sidenav-left'
          : 'dashboard-grid-sidenav-right',
        'overflow-hidden will-change-[width]',
        sizeClassName,
        isOverlayMode && `${overlayPosition} top-0 bottom-0 z-20 shadow-2xl`,
        isOverlayMode && position === 'left' && 'left-0',
        isOverlayMode && position === 'right' && 'right-0'
      )}
    >
      {cloneElement(children, {
        className: clsx(
          children.props.className,
          'w-full h-full',
          status === 'compact' && 'compact-scrollbar'
        ),
        isCompactMode: status === 'compact',
      })}
    </m.div>
  );
}

function getSize(size: SidenavProps['size'] | 'compact'): string {
  switch (size) {
    case 'compact':
      return 'w-80';
    case 'sm':
      return 'w-224';
    case 'md':
      return 'w-240';
    case 'lg':
      return 'w-288';
    default:
      return size || '';
  }
}
