import type {ObjectsSlice} from './objects-slice';

export const DEFAULT_ACTIVE_OBJ_PROPS: ObjectsSlice['objects']['active'] = {
  isMoving: false,
  editableProps: {},
  id: null,
  isText: false,
  isImage: false,
  name: null,
};
