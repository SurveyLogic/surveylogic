import type { ResizePayload } from './resize-tool';
export declare function clampResizePayload(value: ResizePayload): ResizePayload;
export declare function aspectToWidth(newHeight: number, usePercentages: boolean): number;
export declare function aspectToHeight(newWidth: number, usePercentages: boolean): number;
