import {Object as IObject} from 'fabric/fabric-impl';
import {isSvgSticker} from './utils/is-svg-sticker';
import {isText} from './utils/is-text';
import {fireObjModifiedEvent, ObjectOptions} from './object-modified-event';
import {bindToFabricSelectionEvents} from './bind-to-fabric-selection-events';
import {fabricCanvas, state, tools} from '../state/utils';
import {useStore} from '../state/store';
import {randomString} from '@common/utils/string/random-string';

export class ObjectTool {
  constructor() {
    this.syncObjects();

    bindToFabricSelectionEvents();

    state().fabric.on('text:editing:entered', () => {
      state().objects.setIsEditingText(true);
    });
    state().fabric.on('text:editing:exited', () => {
      state().objects.setIsEditingText(false);
    });

    state().fabric.on('object:added', () => {
      this.syncObjects();
    });
    state().fabric.on('object:removed', () => {
      this.syncObjects();
    });
  }

  /**
   * Get all objects that are currently on canvas.
   */
  getAll(): IObject[] {
    return fabricCanvas()
      .getObjects()
      .filter(obj => !obj?.data?.pixieInternal);
  }

  /**
   * Get object with specified name from canvas.
   */
  get(name: string) {
    return this.getAll().find(obj => obj.name === name);
  }

  /**
   * Get object with specified id from canvas.
   */
  getById(id: string) {
    return this.getAll().find(obj => obj.data.id === id);
  }

  /**
   * Check whether specified object is currently selected.
   */
  isActive(objectOrId: IObject | string): boolean {
    const objId =
      typeof objectOrId === 'string' ? objectOrId : objectOrId.data.id;
    return state().objects.active?.id === objId;
  }

  /**
   * Get currently active object.
   */
  getActive(): IObject | null {
    return fabricCanvas().getActiveObject();
  }

  /**
   * Check if object with specified name exists on canvas.
   */
  has(name: string) {
    return this.getAll().findIndex(obj => obj.name === name) > -1;
  }

  /**
   * Select specified object.
   */
  select(objOrId: IObject | string) {
    const obj = typeof objOrId === 'string' ? this.getById(objOrId) : objOrId;
    if (!obj) return;
    fabricCanvas().setActiveObject(obj);
    fabricCanvas().requestRenderAll();
  }

  /**
   * Deselect currently active object.
   */
  deselectActive() {
    fabricCanvas().discardActiveObject();
    fabricCanvas().requestRenderAll();
  }

  /**
   * Apply values to specified or currently active object.
   */
  setValues(values: ObjectOptions, obj?: IObject | null) {
    obj = obj || this.getActive();
    if (!obj) return;

    let fontChanged = false;

    // apply fill color to each svg line separately, so sticker
    // is not recolored when other values like shadow change
    if (isSvgSticker(obj) && values.fill && values.fill !== obj.fill) {
      obj.forEachObject(path => path.set('fill', values.fill));
    }

    if (isText(obj)) {
      if (
        values.fontFamily !== obj.fontFamily ||
        values.fontSize !== obj.fontSize
      ) {
        fontChanged = true;
      }
      if (obj.selectionStart !== obj.selectionEnd) {
        obj.setSelectionStyles(values);
      } else {
        obj.set(values);
      }
    } else {
      obj.set(values);
    }

    // sometimes changes are not rendered until next render without this
    if (fontChanged) {
      setTimeout(() => {
        fabricCanvas().requestRenderAll();
      }, 50);
    } else {
      fabricCanvas().requestRenderAll();
    }

    state().objects.setActive(obj);
    fireObjModifiedEvent(values);
  }

  /**
   * Move specified or currently active object in given direction.
   */
  move(
    direction: 'up' | 'right' | 'down' | 'left',
    amount: number = 1,
    obj?: IObject | null
  ) {
    obj = obj || this.getActive();
    if (!obj) return;
    if (direction === 'up') {
      this.setValues({top: obj.top! - amount});
    } else if (direction === 'down') {
      this.setValues({top: obj.top! + amount});
    } else if (direction === 'left') {
      this.setValues({left: obj.left! - amount});
    } else if (direction === 'right') {
      this.setValues({left: obj.left! + amount});
    }
    tools().canvas.render();
  }

  /**
   * Bring specified or currently active object to front of canvas.
   */
  bringToFront(obj?: IObject | null) {
    obj = obj || this.getActive();
    if (!obj) return;
    obj.bringToFront();
    tools().canvas.render();
  }

  /**
   * Send specified or currently active object to the back of canvas.
   */
  sendToBack(obj?: IObject | null) {
    obj = obj || this.getActive();
    if (!obj) return;
    obj.sendToBack();
    tools().canvas.render();
  }

  /**
   * Flip specified or currently active object horizontally.
   */
  flipHorizontally(obj?: IObject | null) {
    obj = obj || this.getActive();
    if (!obj) return;
    this.setValues({flipX: !obj.flipX});
    tools().canvas.render();
  }

  /**
   * Duplicate specified or currently active object.
   */
  duplicate(obj?: IObject | null) {
    const original = obj || this.getActive();
    if (!original) return;

    this.deselectActive();

    original.clone((clonedObj: IObject) => {
      clonedObj.set({
        left: original.left! + 40,
        top: original.top! + 40,
        data: {...original.data, id: randomString(10)},
        name: original.name,
      });

      fabricCanvas().add(clonedObj);
      this.select(clonedObj);
      tools().canvas.render();
    });
  }

  /**
   * Delete specified or currently active object.
   */
  delete(obj?: IObject | null) {
    obj = obj || this.getActive();
    if (!obj) return;
    this.deselectActive();
    fabricCanvas().remove(obj);
    fabricCanvas().requestRenderAll();
    tools().history.addHistoryItem({name: 'deletedObject'});
  }

  /**
   * Sync layers list with fabric.js objects.
   * @hidden
   */
  syncObjects() {
    const partial = this.getAll().map(o => ({
      name: o.name!,
      selectable: o.selectable ?? false,
      id: o.data.id,
    }));
    useStore.setState({
      objects: {
        ...state().objects,
        all: partial,
      },
    });
  }
}
