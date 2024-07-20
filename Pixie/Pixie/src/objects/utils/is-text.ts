import {IObjectOptions, IText, Object} from 'fabric/fabric-impl';

export function isText(
  obj: Object | IObjectOptions | null | undefined
): obj is IText {
  return obj?.type === 'i-text';
}
