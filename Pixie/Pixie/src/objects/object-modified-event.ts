import {IImageOptions, IObjectOptions, ITextOptions} from 'fabric/fabric-impl';
import {SIZE_AND_POSITION_PROPS} from './size-and-position-props';
import {fabricCanvas} from '../state/utils';

export type ObjectOptions = IObjectOptions &
  ITextOptions &
  IImageOptions & {src?: string};

export interface ObjectModifiedEvent {
  values: ObjectOptions;
  sizeOrPositionChanged: boolean;
}

export function fireObjModifiedEvent(values: ObjectOptions = {}) {
  fabricCanvas().fire('object:modified', buildObjModifiedEvent(values));
}

export function buildObjModifiedEvent(
  values: ObjectOptions
): ObjectModifiedEvent {
  return {
    values,
    sizeOrPositionChanged: sizeOrPositionChanged(values),
  };
}

function sizeOrPositionChanged(values: ObjectOptions): boolean {
  return Object.keys(values).some(r =>
    SIZE_AND_POSITION_PROPS.includes(r as keyof ObjectOptions)
  );
}
