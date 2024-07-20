import { IImageOptions, IObjectOptions, ITextOptions } from 'fabric/fabric-impl';
export type ObjectOptions = IObjectOptions & ITextOptions & IImageOptions & {
    src?: string;
};
export interface ObjectModifiedEvent {
    values: ObjectOptions;
    sizeOrPositionChanged: boolean;
}
export declare function fireObjModifiedEvent(values?: ObjectOptions): void;
export declare function buildObjModifiedEvent(values: ObjectOptions): ObjectModifiedEvent;
