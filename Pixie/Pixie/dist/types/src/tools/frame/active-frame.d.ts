import { Rect } from 'fabric/fabric-impl';
import { Frame } from './frame';
export interface ActiveFrameParts {
    topLeft: Rect;
    top: Rect;
    topRight: Rect;
    right: Rect;
    bottomRight: Rect;
    bottom: Rect;
    bottomLeft: Rect;
    left: Rect;
}
export declare class ActiveFrame {
    /**
     * List of frame corner names.
     */
    readonly corners: readonly ["topLeft", "topRight", "bottomLeft", "bottomRight"];
    /**
     * List of frame side names.
     */
    readonly sides: readonly ["top", "right", "bottom", "left"];
    parts: ActiveFrameParts | null;
    /**
     * Configuration for currently active frame.
     */
    config: Frame | null;
    /**
     * Current size of frame in percents relative to canvas size.
     */
    currentSizeInPercent: number;
    getPartNames(): ("left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight")[];
    hide(): void;
    show(): void;
    /**
     * Remove currently active frame.
     */
    remove(): void;
    /**
     * Check if specified frame is active.
     */
    is(frame: Frame): boolean;
    /**
     * Change color of basic frame.
     */
    changeColor(value: string): void;
    getMinSize(): number;
    getMaxSize(): number;
}
