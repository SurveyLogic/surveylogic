import {ComponentType} from 'react';
import {ToolName} from '../tool-name';
import {TuneIcon} from '@common/icons/material/Tune';
import {PhotoSizeSelectLargeIcon} from '@common/icons/material/PhotoSizeSelectLarge';
import {CropIcon} from '@common/icons/material/Crop';
import {TextFieldsIcon} from '@common/icons/material/TextFields';
import {ExtensionIcon} from '@common/icons/material/Extension';
import {FaceIcon} from '@common/icons/material/Face';
import {FilterFramesIcon} from '@common/icons/material/FilterFrames';
import {MergeIcon} from '@common/icons/material/Merge';
import {RoundedCornerIcon} from '@common/icons/material/RoundedCorner';
import {PhotoLibraryIcon} from '@common/icons/material/PhotoLibrary';
import {HistoryIcon} from '@common/icons/material/History';
import {StyleIcon} from '@common/icons/material/Style';
import {DeleteIcon} from '@common/icons/material/Delete';
import {SvgIconProps} from '@common/icons/svg-icon';
import {DrawIcon} from '../../ui/icons/draw';
import {HomeIcon} from '@common/icons/material/Home';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

export const HISTORY_DISPLAY_NAMES: Record<
  HistoryName,
  {name: MessageDescriptor; icon: ComponentType<SvgIconProps>}
> = {
  [ToolName.FILTER]: {
    name: message('Applied Filters'),
    icon: TuneIcon,
  },
  [ToolName.RESIZE]: {
    name: message('Resized Image'),
    icon: PhotoSizeSelectLargeIcon,
  },
  [ToolName.CROP]: {
    name: message('Cropped Image'),
    icon: CropIcon,
  },
  [ToolName.DRAW]: {
    name: message('Added Drawing'),
    icon: DrawIcon,
  },
  [ToolName.TEXT]: {
    name: message('Added Text'),
    icon: TextFieldsIcon,
  },
  [ToolName.SHAPES]: {
    name: message('Added Shape'),
    icon: ExtensionIcon,
  },
  [ToolName.STICKERS]: {
    name: message('Added Sticker'),
    icon: FaceIcon,
  },
  [ToolName.FRAME]: {
    name: message('Added Frame'),
    icon: FilterFramesIcon,
  },
  [ToolName.MERGE]: {
    name: message('Merged Objects'),
    icon: MergeIcon,
  },
  [ToolName.CORNERS]: {
    name: message('Rounded Corner'),
    icon: RoundedCornerIcon,
  },
  bgImage: {
    name: message('Replaced Background Image'),
    icon: PhotoLibraryIcon,
  },
  overlayImage: {
    name: message('Added Image'),
    icon: PhotoLibraryIcon,
  },
  initial: {name: message('Initial'), icon: HomeIcon},
  loadedState: {
    name: message('Loaded State'),
    icon: HistoryIcon,
  },
  objectStyle: {
    name: message('Changed Style'),
    icon: StyleIcon,
  },
  deletedObject: {
    name: message('Deleted object'),
    icon: DeleteIcon,
  },
};

export type HistoryName =
  | ToolName
  | 'initial'
  | 'loadedState'
  | 'bgImage'
  | 'overlayImage'
  | 'objectStyle'
  | 'deletedObject';
