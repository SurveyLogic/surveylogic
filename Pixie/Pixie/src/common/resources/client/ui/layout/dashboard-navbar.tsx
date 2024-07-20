import {Navbar, NavbarProps} from '../navigation/navbar/navbar';
import {IconButton} from '../buttons/icon-button';
import React, {useContext} from 'react';
import clsx from 'clsx';
import {DashboardLayoutContext} from './dashboard-layout-context';
import {setInLocalStorage} from '../../utils/hooks/local-storage';
import {MenuOpenIcon} from '@common/icons/material/MenuOpen';

export interface DashboardNavbarProps
  extends Omit<NavbarProps, 'toggleButton'> {
  hideToggleButton?: boolean;
}
export function DashboardNavbar({
  children,
  className,
  hideToggleButton,
  ...props
}: DashboardNavbarProps) {
  const {
    isMobileMode,
    leftSidenavStatus,
    setLeftSidenavStatus,
    name,
    leftSidenavCanBeCompact,
  } = useContext(DashboardLayoutContext);

  const shouldToggleCompactMode = leftSidenavCanBeCompact && !isMobileMode;
  const shouldShowToggle =
    !hideToggleButton && (isMobileMode || leftSidenavCanBeCompact);

  const handleToggle = () => {
    setLeftSidenavStatus(leftSidenavStatus === 'open' ? 'closed' : 'open');
  };

  const handleCompactModeToggle = () => {
    const newStatus = leftSidenavStatus === 'compact' ? 'open' : 'compact';
    setInLocalStorage(`${name}.sidenav.compact`, newStatus === 'compact');
    setLeftSidenavStatus(newStatus);
  };

  return (
    <Navbar
      className={clsx('dashboard-grid-navbar', className)}
      border="border-b"
      size="sm"
      color="primary"
      darkModeColor="bg-alt"
      toggleButton={
        shouldShowToggle ? (
          <IconButton
            size="md"
            onClick={() => {
              if (shouldToggleCompactMode) {
                handleCompactModeToggle();
              } else {
                handleToggle();
              }
            }}
          >
            <MenuOpenIcon />
          </IconButton>
        ) : undefined
      }
      {...props}
    >
      {children}
    </Navbar>
  );
}
