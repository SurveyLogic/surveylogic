type ValidFormats = 'png' | 'jpeg' | 'json' | 'svg';
export declare class ExportTool {
    /**
     * Primary "save" function. This is called when user clicks "Done" button in the toolbar.
     * It will apply watermark (if specified) and execute one of the actions below in the order of priority:
     *
     * 1. Send image data to url. If specified via "saveUrl" option in configuration.
     * 2. Execute "onSave" callback function. If provided in configuration.
     * 3. Download image or state file to user device with specified name, format and quality.
     */
    save(name?: string, format?: ValidFormats, quality?: number): void;
    /**
     * Returns base64 encoded data for current image.
     */
    getDataUrl(format?: ValidFormats, quality?: number): string | null;
    private getCanvasBlob;
    private getJsonState;
    private prepareCanvas;
    private applyWaterMark;
    private getFormat;
    private getQuality;
}
export {};
