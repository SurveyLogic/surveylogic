import {IObjectOptions} from 'fabric/fabric-impl';

export const staticObjectConfig: IObjectOptions = {
  selectable: false,
  evented: false,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true,
  hasControls: false,
  hasBorders: false,
  hasRotatingPoint: false,
  strokeWidth: 0,
};
