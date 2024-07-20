import {createContext} from 'react';

export type DashboardSidenavStatus = 'open' | 'closed' | 'compact';

export interface DashboardContextValue {
  leftSidenavStatus: DashboardSidenavStatus;
  setLeftSidenavStatus: (status: DashboardSidenavStatus) => void;
  rightSidenavStatus: DashboardSidenavStatus;
  setRightSidenavStatus: (status: DashboardSidenavStatus) => void;
  isMobileMode: boolean | null;
  leftSidenavCanBeCompact?: boolean;
  name: string;
}

export const DashboardLayoutContext = createContext<DashboardContextValue>(
  null!
);
