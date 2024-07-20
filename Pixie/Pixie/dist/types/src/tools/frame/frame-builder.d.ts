import { ActiveFrame } from './active-frame';
import { FramePatterns } from './frame-patterns';
import { Frame } from './frame';
export declare class FrameBuilder {
    private activeFrame;
    private patterns;
    get defaultColor(): string | undefined;
    constructor(activeFrame: ActiveFrame, patterns: FramePatterns);
    /**
     * Build a new canvas frame group.
     */
    build(frame: Frame, size: number): void;
    /**
     * Create rect object for each frame part.
     */
    private createParts;
    /**
     * Position and resize all frame parts.
     */
    resize(value: number): void;
}
