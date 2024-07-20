export declare class WatermarkTool {
    private watermark;
    private lineStyle;
    /**
     * Add a watermark to canvas.
     */
    add(watermarkText: string): void;
    /**
     * Remove watermark from canvas.
     */
    remove(): void;
    private createGroup;
    private addText;
    private addLines;
}
