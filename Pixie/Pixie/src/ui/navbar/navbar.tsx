import {AnimatePresence, m} from 'framer-motion';
import React from 'react';
import {useStore} from '../../state/store';
import {NavItem} from '../../config/default-config';
import {setActiveTool} from './set-active-tool';
import {ToolControls} from './tool-controls';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {navbarAnimation} from './navbar-animation';
import {navItemMessages} from '../../config/default-nav-items';
import {state} from '../../state/utils';
import {ScrollableView, ScrollableViewItem} from './scrollable-view';
import {MixedIcon} from '../mixed-icon';
import {Trans} from '@common/i18n/trans';
import clsx from 'clsx';

interface NavbarProps {
  className?: string;
}
export function Navbar({className}: NavbarProps) {
  const activeTool = useStore(s => s.activeTool);
  return (
    <nav
      className={clsx(
        'z-navbar min-h-86 flex-shrink-0 px-16 relative overflow-hidden',
        className
      )}
    >
      <AnimatePresence initial={false}>
        {activeTool ? (
          <ToolControls activeTool={activeTool} key="tool-controls" />
        ) : (
          <NavItems key="nav-items" />
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItems() {
  const navItems = useStore(s => s.config.ui?.nav?.items) || [];
  return (
    <m.div className="w-full h-full bg-inherit" {...navbarAnimation}>
      <ScrollableView>
        {navItems.map(item => (
          <ScrollableViewItem key={item.name}>
            <ToolButton item={item} />
          </ScrollableViewItem>
        ))}
      </ScrollableView>
    </m.div>
  );
}

type ToolButtonProps = {
  item: NavItem;
};

function ToolButton({item}: ToolButtonProps) {
  const clickHandler = () => {
    if (typeof item.action === 'string') {
      setActiveTool(item.action);
    } else if (typeof item.action === 'function') {
      item.action(state().editor);
    }
  };
  const msg = navItemMessages[item.name];
  return (
    <ButtonBase
      variant="outline"
      color="paper"
      className="flex-col flex-shrink-0 w-68 h-68"
      radius="rounded-2xl"
      onClick={clickHandler}
    >
      <div className="mb-1">
        <MixedIcon className="icon-md" icon={item.icon} />
      </div>
      <div className="mt-6 text-xs capitalize max-w-[90%] overflow-hidden overflow-ellipsis">
        {msg ? <Trans {...msg} /> : item.name}
      </div>
    </ButtonBase>
  );
}
