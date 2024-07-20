import React, {useContext, useState} from 'react';
import {useLayoutEffect} from '@react-aria/utils';
import clsx from 'clsx';
import {TabContext} from './tabs-context';

interface TabLineStyle {
  width?: string;
  transform?: string;
  className?: string;
}

export function TabLine() {
  const {tabsRef, selectedTab} = useContext(TabContext);
  const [style, setStyle] = useState<TabLineStyle>({
    width: undefined,
    transform: undefined,
    className: undefined,
  });

  useLayoutEffect(() => {
    if (selectedTab != null && tabsRef.current) {
      const el = tabsRef.current[selectedTab];
      if (!el) return;

      setStyle(prevState => {
        return {
          width: `${el.offsetWidth}px`,
          transform: `translateX(${el.offsetLeft}px)`,
          // disable initial transition for tabline
          className: prevState.width === undefined ? '' : 'transition-all',
        };
      });
    }
  }, [setStyle, selectedTab, tabsRef]);

  return (
    <div
      className={clsx(
        'absolute bottom-0 left-0 h-2 bg-primary',
        style.className
      )}
      role="presentation"
      style={{width: style.width, transform: style.transform}}
    />
  );
}
