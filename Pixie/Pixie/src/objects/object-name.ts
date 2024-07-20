import {HISTORY_DISPLAY_NAMES} from '../tools/history/history-display-names';
import {message} from '@common/i18n/message';

export enum ObjectName {
  Text = 'text',
  Shape = 'shape',
  Sticker = 'sticker',
  Drawing = 'drawing',
  Image = 'image',
  MainImage = 'mainImage',
  StraightenAnchor = 'straightenHelper',
}

export const OBJ_DISPLAY_NAMES = {
  [ObjectName.Text]: {
    name: message('Text'),
    icon: HISTORY_DISPLAY_NAMES.text.icon,
  },
  [ObjectName.Shape]: {
    name: message('Shape'),
    icon: HISTORY_DISPLAY_NAMES.shapes.icon,
  },
  [ObjectName.Sticker]: {
    name: message('Sticker'),
    icon: HISTORY_DISPLAY_NAMES.stickers.icon,
  },
  [ObjectName.Drawing]: {
    name: message('Drawing'),
    icon: HISTORY_DISPLAY_NAMES.draw.icon,
  },
  [ObjectName.Image]: {
    name: message('Image'),
    icon: HISTORY_DISPLAY_NAMES.overlayImage.icon,
  },
  [ObjectName.MainImage]: {
    name: message('Background Image'),
    icon: HISTORY_DISPLAY_NAMES.bgImage.icon,
  },
};
