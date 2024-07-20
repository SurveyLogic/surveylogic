import { Image, StaticCanvas } from 'fabric/fabric-impl';
import { ActiveFrame, ActiveFrameParts } from './active-frame';
import { Frame } from './frame';
interface FramePatternPart {
    name: keyof ActiveFrameParts;
    img: Image;
    canvas: StaticCanvas;
}
export declare class FramePatterns {
    private activeFrame;
    patternCache: FramePatternPart[];
    constructor(activeFrame: ActiveFrame);
    /**
     * Fill frame part objects with matching pattern images.
     */
    private fillParts;
    /**
     * Fill specified frame part with matching pattern.
     */
    private fillPartWithPattern;
    /**
     * Scale all frame patterns to fill their container rect objects.
     */
    scale(value: number): void;
    /**
     * Scale pattern image to specified width.
     */
    private scalePatternToWidth;
    /**
     * Scale pattern image to specified height.
     */
    private scalePatternToHeight;
    /**
     * Load all images needed to build specified frame.
     */
    load(frame: Frame): Promise<void>;
    private getPartUrl;
}
export {};
