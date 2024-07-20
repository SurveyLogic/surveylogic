import React, {ReactElement, useId, useMemo, useRef} from 'react';
import clsx from 'clsx';
import {useControlledState} from '@react-stately/utils';
import {TabContext, TabsContext} from './tabs-context';
import {TabListProps} from './tab-list';
import {TabPanelsProps} from './tab-panels';

export interface TabsProps {
  children: [ReactElement<TabListProps>, ReactElement<TabPanelsProps>];
  size?: 'sm' | 'md';
  className?: string;
  selectedTab?: number;
  defaultSelectedTab?: number;
  onTabChange?: (newTab: number) => void;
  isLazy?: boolean;
  overflow?: string;
}

export function Tabs(props: TabsProps) {
  const {
    size = 'md',
    children,
    className,
    isLazy,
    overflow = 'overflow-hidden',
  } = props;

  const tabsRef = useRef<HTMLButtonElement[]>([]);
  const id = useId();

  const [selectedTab, setSelectedTab] = useControlledState(
    props.selectedTab,
    props.defaultSelectedTab || 0,
    props.onTabChange
  );

  const ContextValue: TabsContext = useMemo(() => {
    return {
      selectedTab,
      setSelectedTab,
      tabsRef,
      size,
      isLazy,
      id,
    };
  }, [selectedTab, id, isLazy, setSelectedTab, size]);

  return (
    <TabContext.Provider value={ContextValue}>
      <div className={clsx(className, overflow, 'max-w-full')}>{children}</div>
    </TabContext.Provider>
  );
}
