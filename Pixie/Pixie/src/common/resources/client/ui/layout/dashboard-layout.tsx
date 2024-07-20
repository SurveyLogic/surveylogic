import {ComponentPropsWithoutRef, useCallback, useMemo} from 'react';
import {
  DashboardLayoutContext,
  DashboardSidenavStatus,
} from './dashboard-layout-context';
import {Underlay} from '../overlays/underlay';
import {AnimatePresence} from 'framer-motion';
import {useControlledState} from '@react-stately/utils';
import {useMediaQuery} from '../../utils/hooks/use-media-query';
import {
  getFromLocalStorage,
  setInLocalStorage,
} from '../../utils/hooks/local-storage';
import {useBlockBodyOverflow} from '../../utils/hooks/use-block-body-overflow';
import clsx from 'clsx';

interface DashboardLayoutProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  leftSidenavCanBeCompact?: boolean;
  leftSidenavStatus?: DashboardSidenavStatus;
  onLeftSidenavChange?: (status: DashboardSidenavStatus) => void;
  rightSidenavStatus?: DashboardSidenavStatus;
  initialRightSidenavStatus?: DashboardSidenavStatus;
  onRightSidenavChange?: (status: DashboardSidenavStatus) => void;
  height?: string;
}
export function DashboardLayout({
  children,
  leftSidenavStatus: leftSidenav,
  onLeftSidenavChange,
  rightSidenavStatus: rightSidenav,
  initialRightSidenavStatus,
  onRightSidenavChange,
  name,
  leftSidenavCanBeCompact,
  height = 'h-full',
  ...domProps
}: DashboardLayoutProps) {
  useBlockBodyOverflow();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const isCompactModeInitially = useMemo(() => {
    return !name ? false : getFromLocalStorage(`${name}.sidenav.compact`);
  }, [name]);
  const defaultLeftSidenavStatus = isCompactModeInitially ? 'compact' : 'open';
  const [leftSidenavStatus, setLeftSidenavStatus] = useControlledState(
    leftSidenav,
    isMobile ? 'closed' : defaultLeftSidenavStatus,
    onLeftSidenavChange
  );

  const rightSidenavStatusDefault = useMemo(() => {
    if (isMobile) {
      return 'closed';
    }
    if (initialRightSidenavStatus != null) {
      return initialRightSidenavStatus;
    }
    const userSelected = getFromLocalStorage(
      `${name}.sidenav.right.position`,
      'open'
    );
    if (userSelected != null) {
      return userSelected;
    }
    return initialRightSidenavStatus || 'closed';
  }, [isMobile, name, initialRightSidenavStatus]);
  const [rightSidenavStatus, _setRightSidenavStatus] = useControlledState(
    rightSidenav,
    rightSidenavStatusDefault,
    onRightSidenavChange
  );
  const setRightSidenavStatus = useCallback(
    (status: DashboardSidenavStatus) => {
      _setRightSidenavStatus(status);
      setInLocalStorage(`${name}.sidenav.right.position`, status);
    },
    [_setRightSidenavStatus, name]
  );

  const shouldShowUnderlay =
    isMobile && (leftSidenavStatus === 'open' || rightSidenavStatus === 'open');

  return (
    <DashboardLayoutContext.Provider
      value={{
        leftSidenavStatus,
        setLeftSidenavStatus,
        rightSidenavStatus,
        setRightSidenavStatus,
        leftSidenavCanBeCompact,
        name,
        isMobileMode: isMobile,
      }}
    >
      <div
        {...domProps}
        className={clsx(
          'dashboard-grid test-overflow relative isolate',
          height
        )}
      >
        {children}
        <AnimatePresence>
          {shouldShowUnderlay && (
            <Underlay
              position="fixed"
              key="dashboard-underlay"
              onClick={() => {
                setLeftSidenavStatus('closed');
                setRightSidenavStatus('closed');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayoutContext.Provider>
  );
}
