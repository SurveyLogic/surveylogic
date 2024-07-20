import type { StoreSlice } from '../../state/store';
import { ToolSlice } from '../../state/tool-slice';
export interface FilterSlice {
    filter: ToolSlice & {
        selected: string | null;
        applied: string[];
        select: (selected: string, hasOptions?: boolean) => void;
        deselect: (filterName: string) => void;
    };
}
export declare const createFilterSlice: StoreSlice<FilterSlice>;
