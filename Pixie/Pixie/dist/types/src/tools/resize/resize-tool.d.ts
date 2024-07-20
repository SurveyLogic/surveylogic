export declare class ResizeTool {
    /**
     * Resize image and other canvas objects.
     * If "usePercentages" is false, width/height should be pixels.
     */
    apply(payload: ResizePayload): void;
    /**
     * Resize canvas and all objects to specified scale.
     */
    private resize;
}
export interface ResizePayload {
    width: number;
    height: number;
    maintainAspect: boolean;
    usePercentages: boolean;
}
