import {Group, Object} from 'fabric/fabric-impl';
import {ObjectName} from '../object-name';

export function isSvgSticker(obj: Object): obj is Group {
  return obj.name === ObjectName.Sticker && 'forEachObject' in obj;
}
