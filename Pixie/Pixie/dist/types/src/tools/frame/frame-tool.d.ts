import { Frame } from './frame';
import { FrameBuilder } from './frame-builder';
import { ActiveFrame } from './active-frame';
export declare class FrameTool {
    private readonly patterns;
    builder: FrameBuilder;
    active: ActiveFrame;
    constructor();
    /**
     * Add a new frame to canvas.
     */
    add(frameName: string, sizePercent?: number): void;
    /**
     * Resize active frame to specified percentage relative to canvas size.
     */
    resize(percentage?: number): void;
    /**
     * Change color of currently active frame. Only works for "basic" frame.
     */
    changeColor(value: string): void;
    /**
     * Remove currently active frame.
     */
    remove(): void;
    /**
     * Get frame by specified name.
     */
    getByName(frameName: string): Frame | undefined;
    /**
     * @hidden
     */
    getActiveFrameConfig(): Frame | null;
    /**
     * Calculate frame size in pixels based on specified percentage relative to canvas size.
     */
    private calcFrameSizeInPixels;
}
