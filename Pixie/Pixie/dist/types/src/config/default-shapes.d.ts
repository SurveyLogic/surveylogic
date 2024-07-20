import { ICircleOptions, IObjectOptions, IRectOptions } from 'fabric/fabric-impl';
export interface PathOptions extends IObjectOptions {
    path: string | undefined;
}
export interface BasicShape {
    name: string;
    type: string;
    options?: IObjectOptions | IRectOptions | PathOptions | ICircleOptions;
}
export declare const defaultShapes: BasicShape[];
