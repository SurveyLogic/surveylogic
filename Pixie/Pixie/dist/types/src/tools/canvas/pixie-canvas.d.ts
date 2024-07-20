import { Image } from 'fabric/fabric-impl';
import { LoadingType } from '../../state/editor-state';
export declare class PixieCanvas {
    private readonly minWidth;
    private readonly minHeight;
    resize(width: number, height: number, { applyZoom, resizeHelper, }?: {
        applyZoom?: boolean;
        resizeHelper?: boolean;
    }): void;
    addMainImage(url: string, loadStateName?: LoadingType): Promise<Image | undefined>;
    openNew(width: number, height: number, bgColor?: string): Promise<{
        width: number;
        height: number;
    }>;
    /**
     * Get main image object, if it exists.
     */
    getMainImage(): Image;
    render(): void;
    loadInitialContent(): Promise<void>;
    clear(): void;
}
