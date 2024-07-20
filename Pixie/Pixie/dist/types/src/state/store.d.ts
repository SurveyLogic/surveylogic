import { GetState } from 'zustand';
import { Draft } from 'immer';
import { HistorySlice } from '../tools/history/state/history-slice';
import { FilterSlice } from '../tools/filter/filter-slice';
import { CropSlice } from '../tools/crop/crop-slice';
import { ObjectsSlice } from '../objects/state/objects-slice';
import { FrameSlice } from '../tools/frame/frame-slice';
import { ResizeSlice } from '../tools/resize/state/resize-slice';
import { EditorState } from './editor-state';
import { CornersSlice } from '../tools/corners/corners-slice';
export type StoreSlice<T> = (set: (partial: ((draft: Draft<PixieState>) => void) | Partial<PixieState>, replace?: boolean) => void, get: GetState<PixieState>) => T;
export type PixieState = EditorState & HistorySlice & ObjectsSlice & FilterSlice & CropSlice & FrameSlice & ResizeSlice & CornersSlice;
export declare const useStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<PixieState>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: PixieState, previousSelectedState: PixieState) => void): () => void;
        <U>(selector: (state: PixieState) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
}, "setState"> & {
    setState(nextStateOrUpdater: PixieState | Partial<PixieState> | ((state: import("immer/dist/internal").WritableDraft<PixieState>) => void), shouldReplace?: boolean | undefined): void;
}>;
