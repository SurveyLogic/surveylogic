import { Object } from 'fabric/fabric-impl';
import type { StoreSlice } from '../../state/store';
import { ObjectName } from '../object-name';
import type { EditableObjProps } from './editable-obj-props';
import { PartialObject } from './partial-object';
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
export declare const createObjectsSlice: StoreSlice<ObjectsSlice>;
