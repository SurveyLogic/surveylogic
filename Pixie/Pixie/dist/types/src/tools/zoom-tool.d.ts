export declare class ZoomTool {
    protected readonly maxZoom = 2;
    protected minZoom: number;
    readonly step = 0.05;
    get allowUserZoom(): boolean;
    get currentZoom(): number;
    constructor();
    zoomIn(amount?: number): void;
    canZoomIn(amount?: number): boolean;
    canZoomOut(amount?: number): boolean;
    zoomOut(amount?: number): void;
    /**
     * Zoom canvas to specified scale.
     */
    set(newZoom: number, resize?: boolean): void;
    /**
     * Resize canvas to fit available screen space.
     */
    fitToScreen(): void;
    private bindMouseWheel;
}
