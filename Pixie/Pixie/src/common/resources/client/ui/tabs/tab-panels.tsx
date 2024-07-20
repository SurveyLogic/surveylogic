import React, {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import {useLayoutEffect} from '@react-aria/utils';
import {getFocusableTreeWalker} from '@react-aria/focus';
import {TabContext} from './tabs-context';

export interface TabPanelsProps {
  children: ReactNode;
  className?: string;
}
export function TabPanels({children, className}: TabPanelsProps) {
  const {selectedTab, isLazy} = useContext(TabContext);

  // filter out falsy values, in case of conditional rendering
  const panelArray = Children.toArray(children).filter(p => !!p);

  let rendered: ReactNode;
  if (isLazy) {
    const el = panelArray[selectedTab] as ReactElement;
    rendered = isValidElement(el)
      ? cloneElement<TabPanelProps>(panelArray[selectedTab] as ReactElement, {
          index: selectedTab,
        })
      : null;
  } else {
    rendered = panelArray.map((panel, index) => {
      if (isValidElement<TabPanelsProps>(panel)) {
        const isSelected = index === selectedTab;
        return cloneElement<TabPanelProps>(panel, {
          index,
          'aria-hidden': !isSelected,
          className: !isSelected
            ? clsx(panel.props.className, 'hidden')
            : panel.props.className,
        });
      }
      return null;
    });
  }

  return <div className={className}>{rendered}</div>;
}

interface TabPanelProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  children: ReactNode;
  index?: number;
}
export function TabPanel({
  className,
  children,
  index,
  ...domProps
}: TabPanelProps) {
  const {id} = useContext(TabContext);

  const [tabIndex, setTabIndex] = useState<number | undefined>(0);
  const ref = useRef<HTMLDivElement>(null);

  // The tabpanel should have tabIndex=0 when there are no tabbable elements within it.
  // Otherwise, tabbing from the focused tab should go directly to the first tabbable element
  // within the tabpanel.
  useLayoutEffect(() => {
    if (ref?.current) {
      const update = () => {
        // Detect if there are any tabbable elements and update the tabIndex accordingly.
        const walker = getFocusableTreeWalker(ref.current!, {tabbable: true});
        setTabIndex(walker.nextNode() ? undefined : 0);
      };

      update();

      // Update when new elements are inserted, or the tabIndex/disabled attribute updates.
      const observer = new MutationObserver(update);
      observer.observe(ref.current, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['tabIndex', 'disabled'],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return (
    <div
      tabIndex={tabIndex}
      ref={ref}
      id={`${id}-${index}-tabpanel`}
      aria-labelledby={`${id}-${index}-tab`}
      className={clsx(className, 'focus-visible:outline-primary-light')}
      role="tabpanel"
      {...domProps}
    >
      {children}
    </div>
  );
}
