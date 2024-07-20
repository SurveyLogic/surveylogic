import {Image} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {state} from '../../state/utils';

export function loadFabricImage(data: string): Promise<Image> {
  return new Promise(resolve => {
    fabric.util.loadImage(
      data,
      img => resolve(new fabric.Image(img)),
      null,
      state().config.crossOrigin ? 'anonymous' : undefined
    );
  });
}
