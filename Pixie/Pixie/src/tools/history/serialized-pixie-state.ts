import {IObjectOptions} from 'fabric/fabric-impl';

export interface SerializedPixieState {
  canvas: SerializedFabricState;
  editor: {
    frame: {name: string; sizePercent: number} | null;
    zoom: number;
    activeObjectId: string | null;
  };
  canvasWidth: number;
  canvasHeight: number;
}

export const DEFAULT_SERIALIZED_EDITOR_STATE = {
  frame: null,
  fonts: [],
};

export interface SerializedFabricState {
  objects: IObjectOptions[];
}
