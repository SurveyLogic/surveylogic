export declare class TransformTool {
    private get straightenAnchor();
    /**
     * Rotate canvas left by 90 degrees.
     */
    rotateLeft(): void;
    /**
     * Rotate canvas right by 90 degrees.
     */
    rotateRight(): void;
    /**
     * Straighten canvas by specified number of degrees.
     */
    straighten(degrees: number): void;
    /**
     * Flip canvas vertically or horizontally.
     */
    flip(direction: 'horizontal' | 'vertical'): void;
    private rotateFixed;
    /**
     * Get minimum scale in order for image to fill the whole canvas, based on rotation.
     */
    private getImageScale;
    private storeObjectsRelationToHelper;
    private transformObjectsBasedOnHelper;
    /**
     * @hidden
     */
    resetStraightenAnchor(): void;
}
