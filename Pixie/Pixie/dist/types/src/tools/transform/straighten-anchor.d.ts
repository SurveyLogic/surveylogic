import { Rect } from 'fabric/fabric-impl';
export interface StraightenAnchor extends Rect {
    data: {
        straightenAngle: number;
        rotateAngle: number;
    };
}
