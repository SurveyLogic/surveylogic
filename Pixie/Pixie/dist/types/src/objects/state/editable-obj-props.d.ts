import { IObjectOptions, IShadowOptions, ITextOptions } from 'fabric/fabric-impl';
import type { TextAlign } from './text-align';
export interface EditableObjProps {
    fontFamily?: string;
    fontWeight?: ITextOptions['fontWeight'];
    fontSize?: number;
    textAlign?: TextAlign;
    fill?: IObjectOptions['fill'];
    backgroundColor?: string;
    fontStyle?: ITextOptions['fontStyle'];
    underline?: boolean;
    linethrough?: boolean;
    opacity?: number;
    shadowColor?: string;
    shadowString?: string;
    shadow?: IShadowOptions;
    stroke?: string;
    strokeWidth?: number;
}
