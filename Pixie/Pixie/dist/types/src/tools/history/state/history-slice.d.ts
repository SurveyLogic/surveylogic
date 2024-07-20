import { HistoryItem } from '../history-item.interface';
import type { StoreSlice } from '../../../state/store';
export interface HistorySlice {
    history: {
        items: HistoryItem[];
        pointer: number;
        canUndo: boolean;
        canRedo: boolean;
        updatePointerById: (id: string) => void;
        update: (pointer: number, items?: HistoryItem[]) => void;
        reset: (newState?: HistorySlice['history']) => void;
    };
}
export declare const createHistorySlice: StoreSlice<HistorySlice>;
