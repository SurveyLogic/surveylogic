import {Image, Object} from 'fabric/fabric-impl';
import {ObjectName} from '../object-name';

export function isImage(obj: Object): obj is Image {
  return obj.name === ObjectName.Image;
}
