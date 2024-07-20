import { ITextOptions } from 'fabric/fabric-impl';
export declare class TextTool {
    private readonly minWidth;
    /**
     * Add specified text to canvas.
     */
    add(text?: string, providedConfig?: ITextOptions): void;
    private autoPositionText;
    /**
     * Select first text object on canvas if it exists, otherwise add a new one.
     */
    selectOrAddText(text?: string, providedConfig?: ITextOptions): boolean;
}
