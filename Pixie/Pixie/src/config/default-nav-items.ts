import {ToolName} from '../tools/tool-name';
import type {NavItem} from './default-config';
import type {Pixie} from '../pixie';
import {HISTORY_DISPLAY_NAMES} from '../tools/history/history-display-names';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

export const DEFAULT_NAV_ITEMS: NavItem[] = Object.values(ToolName).map(
  toolName => {
    return {
      name: toolName,
      icon: HISTORY_DISPLAY_NAMES[toolName].icon,
      action:
        toolName === ToolName.MERGE
          ? (editor: Pixie) => {
              editor.tools.merge.apply();
            }
          : toolName,
    };
  }
);

export const navItemMessages: Record<string, MessageDescriptor> = {
  filter: message('Filter'),
  resize: message('Resize'),
  crop: message('Crop'),
  draw: message('Draw'),
  text: message('Text'),
  shapes: message('Shapes'),
  Stickers: message('Stickers'),
  frame: message('Frame'),
  corners: message('Corners'),
  merge: message('Merge'),
};
