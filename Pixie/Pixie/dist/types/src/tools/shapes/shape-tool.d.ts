import { Object } from 'fabric/fabric-impl';
import { BasicShape } from '../../config/default-shapes';
import { StickerCategory } from '../../config/default-stickers';
import { ObjectName } from '../../objects/object-name';
export declare class ShapeTool {
    getShapeByName(name: string): BasicShape | null;
    addBasicShape(shapeName: string): Object | null;
    addSticker(categoryName: string, name: number | string): Promise<void>;
    private addRegularSticker;
    addSvgSticker(url: string, objectName?: ObjectName): Promise<void>;
    private addAndPositionShape;
}
export declare function stickerUrl(category: StickerCategory, stickerName: number | string): string;
