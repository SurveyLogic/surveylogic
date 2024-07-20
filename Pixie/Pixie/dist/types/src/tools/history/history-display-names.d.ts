import { ComponentType } from 'react';
import { ToolName } from '../tool-name';
import { SvgIconProps } from '@common/icons/svg-icon';
import { MessageDescriptor } from '@common/i18n/message-descriptor';
export declare const HISTORY_DISPLAY_NAMES: Record<HistoryName, {
    name: MessageDescriptor;
    icon: ComponentType<SvgIconProps>;
}>;
export type HistoryName = ToolName | 'initial' | 'loadedState' | 'bgImage' | 'overlayImage' | 'objectStyle' | 'deletedObject';
