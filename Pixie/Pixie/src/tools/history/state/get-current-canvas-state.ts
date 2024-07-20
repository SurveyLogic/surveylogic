import {Image} from 'fabric/fabric-impl';
import {
  SerializedFabricState,
  SerializedPixieState,
} from '../serialized-pixie-state';
import {staticObjectConfig} from '../../../objects/static-object-config';
import {isText} from '../../../objects/utils/is-text';
import {fabricCanvas, state, tools} from '../../../state/utils';

export function getCurrentCanvasState(
  customProps: string[] = []
): SerializedPixieState {
  customProps = [
    ...Object.keys(staticObjectConfig),
    'crossOrigin',
    'name',
    'displayName',
    'data',
    ...customProps,
  ];
  const canvas = fabricCanvas().toJSON(
    customProps
  ) as unknown as SerializedFabricState;
  canvas.objects = canvas.objects
    .filter(obj => !obj.data.pixieInternal)
    .map(obj => {
      if (obj.type === 'image' && state().config.crossOrigin) {
        (obj as Image).crossOrigin = 'anonymous';
      }
      // text is not selectable/movable when saving
      // state without first moving the text object
      if (isText(obj)) {
        obj.selectable = true;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.lockUniScaling = false;
      }
      // make sure there are no references to live objects
      return {...obj, data: obj.data ? {...obj.data} : {}};
    });

  const activeFrame = tools().frame.active.config
    ? {
        name: tools().frame.active.config!.name,
        sizePercent: tools().frame.active.currentSizeInPercent,
      }
    : null;

  return {
    canvas,
    editor: {
      frame: activeFrame,
      // fonts: tools().text.getUsedFonts(),
      zoom: state().zoom,
      activeObjectId: state().objects.active?.id || null,
    },
    canvasWidth: state().original.width,
    canvasHeight: state().original.height,
  };
}
