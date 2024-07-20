import type { StoreSlice } from '../../../state/store';
import { ToolSlice } from '../../../state/tool-slice';
interface ResizeFormValue {
    width: number;
    height: number;
    maintainAspect: boolean;
    usePercentages: boolean;
}
export interface ResizeSlice {
    resize: ToolSlice & {
        formValue: ResizeFormValue;
        setFormValue: (val: Partial<ResizeFormValue>) => void;
        reset: () => void;
    };
}
export declare const createResizeSlice: StoreSlice<ResizeSlice>;
export {};
