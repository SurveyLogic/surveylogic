export declare class CornersTool {
    private previewRect;
    apply(radius: number): Promise<void>;
    getPreviewRadius(): number;
    updatePreview(radius: number): void;
    showPreview(): void;
    hidePreview(): void;
}
