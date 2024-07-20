import { Path } from 'fabric/fabric-impl';
export declare class DrawTool {
    private customBrushes;
    currentBrush: {
        type: string;
        color: string | undefined;
        width: number;
    };
    onPathCreated: (e: {
        path: Path;
    }) => void;
    /**
     * Enable drawing mode on canvas.
     */
    enable(): void;
    /**
     * Disable drawing mode on canvas.
     */
    disable(): void;
    getBrushType(): string;
    setBrushType(type: string): void;
    /**
     * Apply current brush styles to fabric.js FreeDrawingBrush instance.
     */
    private applyBrushStyles;
    setBrushSize(size: number): void;
    getBrushSize(): number;
    /**
     * Change color of drawing brush.
     */
    setBrushColor(color: string): void;
    /**
     * Get color of drawing brush.
     */
    getBrushColor(): string | undefined;
}
