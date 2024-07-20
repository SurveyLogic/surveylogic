import {Object} from 'fabric/fabric-impl';
import {castDraft} from 'immer';
import type {StoreSlice} from '../../state/store';
import {isText} from '../utils/is-text';
import {ObjectName} from '../object-name';
import {isImage} from '../utils/is-image';
import {DEFAULT_ACTIVE_OBJ_PROPS} from './default-active-obj-props';
import {fabricObjToState} from './fabric-obj-to-state';
import type {EditableObjProps} from './editable-obj-props';
import {PartialObject} from './partial-object';

export interface ObjectsSlice {
  objects: {
    all: PartialObject[];
    isEditingText: boolean;
    active: {
      id: string | null;
      isText: boolean;
      isImage: boolean;
      editableProps: Partial<EditableObjProps>;
      isMoving: boolean;
      name: ObjectName | null;
    };

    setActive: (obj: Object | null) => void;
    setActiveIsMoving: (value: boolean) => void;
    setIsEditingText: (value: boolean) => void;
    reset: () => void;
  };
}

export const createObjectsSlice: StoreSlice<ObjectsSlice> = (set, get) => ({
  objects: {
    ...objectsSliceDefaults,
    setActiveIsMoving: (value: boolean) => {
      set(state => {
        state.objects.active.isMoving = value;
      });
    },
    setIsEditingText: (value: boolean) => {
      set(state => {
        state.objects.isEditingText = value;
      });
    },
    setActive: obj => {
      if (obj) {
        set(state => {
          state.objects.active.editableProps = castDraft(fabricObjToState(obj));
          state.objects.active.id = obj.data.id;
          state.objects.active.name = (obj.name as ObjectName) ?? null;
          state.objects.active.isText = isText(obj);
          state.objects.active.isImage = isImage(obj);
        });
      } else {
        set(state => {
          const defaultEditableProps = {
            ...get().config.objectDefaults?.global,
            fontFamily: get().config.objectDefaults?.text?.fontFamily,
            fontSize: get().config.objectDefaults?.text?.fontSize,
          };
          state.objects.active = {
            ...DEFAULT_ACTIVE_OBJ_PROPS,
            editableProps: defaultEditableProps,
          };
        });
      }
    },
    reset() {
      set({objects: {...get().objects, ...objectsSliceDefaults}});
    },
  },
});

const objectsSliceDefaults = {
  all: [],
  isEditingText: false,
  active: DEFAULT_ACTIVE_OBJ_PROPS,
};
