import {fabric} from 'fabric';
import {Canvas} from 'fabric/fabric-impl';
import {DEFAULT_OBJ_CONFIG} from '../objects/default-obj-config';
import {randomString} from '@common/utils/string/random-string';
import {state} from '../state/utils';

export function initFabric(canvasEl: HTMLCanvasElement): Canvas {
  const fabricCanvas = new fabric.Canvas(canvasEl, {width: 1, height: 1});
  fabricCanvas.preserveObjectStacking = true;
  fabricCanvas.selection = false;
  fabricCanvas.renderOnAddRemove = false;

  const textureSize = state().config.textureSize;
  if (textureSize) fabric.textureSize = textureSize;

  const userConfig = state().config.objectDefaults?.global;
  const objectDefaults = {
    ...userConfig,
    ...DEFAULT_OBJ_CONFIG,
  };

  Object.keys(objectDefaults).forEach(key => {
    // @ts-ignore
    fabric.Object.prototype[key] = objectDefaults[key];
  });

  // add ID to all objects
  fabricCanvas.on('object:added', e => {
    if (e.target && !e.target?.data?.id) {
      if (!e.target.data) e.target.data = {};
      e.target.data.id = randomString(10);
    }
  });

  // remove native fabric object controls
  const objectControls = fabric.Object.prototype.controls;
  Object.keys(objectControls).forEach(key => {
    delete objectControls[key];
  });

  return fabricCanvas;
}
