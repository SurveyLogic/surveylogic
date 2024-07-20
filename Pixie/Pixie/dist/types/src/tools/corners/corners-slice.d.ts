import { ToolSlice } from '../../state/tool-slice';
import type { StoreSlice } from '../../state/store';
export interface CornersSlice {
    corners: ToolSlice & {
        radius: number;
        setRadius: (radius: number) => void;
    };
}
export declare const createCornersSlice: StoreSlice<CornersSlice>;
