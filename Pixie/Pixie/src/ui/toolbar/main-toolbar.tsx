import {m} from 'framer-motion';
import React, {useMemo} from 'react';
import {useStore} from '../../state/store';
import {toolbarAnimation, toolbarStyle} from './toolbar-style';
import {ToolbarItemConfig} from '../../config/default-config';
import {ToolbarItem} from './toolbar-item/toolbar-item';
import {IconButton} from '@common/ui/buttons/icon-button';
import {state} from '../../state/utils';
import {CloseIcon} from '@common/icons/material/Close';
import {useEditorMode} from '../editor-mode';

export function MainToolbar() {
  const {isModal, isMobile} = useEditorMode();
  const allowEditorClose = useStore(s => s.config.ui?.allowEditorClose) ?? true;
  const items = useStore(s => s.config.ui?.menubar?.items);

  const {left, center, right} = useMemo(() => {
    return groupMenuItems(items || [], isMobile);
  }, [items, isMobile]);

  const closeButton = isModal && isMobile && allowEditorClose && (
    <IconButton
      size="sm"
      className="ml-10"
      onClick={() => {
        state().editor.close();
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <m.div className={toolbarStyle} {...toolbarAnimation}>
      <div className="mr-auto flex items-center gap-8">
        {left.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      <div className="flex items-center gap-10">
        {center.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      <div className="ml-auto flex items-center gap-8">
        {right.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      {closeButton}
    </m.div>
  );
}

function groupMenuItems(
  items: ToolbarItemConfig[],
  isMobile: boolean
): {
  left: ToolbarItemConfig[];
  center: ToolbarItemConfig[];
  right: ToolbarItemConfig[];
} {
  const groupedItems: Record<string, ToolbarItemConfig[]> = {
    left: [],
    center: [],
    right: [],
  };

  (items || [])
    .filter(
      item => (!isMobile && !item.mobileOnly) || (isMobile && !item.desktopOnly)
    )
    .forEach(item => {
      if (item.align === 'left') {
        groupedItems.left.push({...item, position: item.position ?? 1});
      } else if (item.align === 'right') {
        groupedItems.right.push({...item, position: item.position ?? 1});
      } else {
        groupedItems.center.push({...item, position: item.position ?? 1});
      }
    });

  // sort menubar items by "position" prop
  const entries = Object.entries(groupedItems).map(([key, value]) => {
    return [key, value.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))];
  });

  return Object.fromEntries(entries);
}
