import type { StoreSlice } from '../../state/store';
import { Frame } from './frame';
import { ToolSlice } from '../../state/tool-slice';
export interface FrameSlice {
    frame: ToolSlice & {
        active: Frame | null;
        select: (frame: Frame) => void;
        deselect: () => void;
        showOptionsPanel: () => void;
    };
}
export declare const createFrameSlice: StoreSlice<FrameSlice>;
