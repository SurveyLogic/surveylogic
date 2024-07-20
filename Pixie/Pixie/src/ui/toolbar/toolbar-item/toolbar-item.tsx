import React from 'react';
import {ToolbarItemConfig} from '../../../config/default-config';
import {ToolbarButton} from './toolbar-button';
import {UndoRedoBtns} from './undo-redo-btns';
import {ZoomWidget} from './zoom-widget';
import {assetUrl} from '../../../utils/asset-url';

export interface MenubarItemProps {
  item: ToolbarItemConfig;
}

export function ToolbarItem({item}: MenubarItemProps) {
  switch (item.type) {
    case 'undoWidget':
      return <UndoRedoBtns />;
    case 'zoomWidget':
      return <ZoomWidget />;
    case 'button':
      return <ToolbarButton item={item} />;
    case 'image':
      return (
        <img className="h-30 object-cover" src={assetUrl(item.src)} alt="" />
      );
    default:
      return null;
  }
}
