import { Object as IObject } from 'fabric/fabric-impl';
import { ObjectOptions } from './object-modified-event';
export declare class ObjectTool {
    constructor();
    /**
     * Get all objects that are currently on canvas.
     */
    getAll(): IObject[];
    /**
     * Get object with specified name from canvas.
     */
    get(name: string): IObject | undefined;
    /**
     * Get object with specified id from canvas.
     */
    getById(id: string): IObject | undefined;
    /**
     * Check whether specified object is currently selected.
     */
    isActive(objectOrId: IObject | string): boolean;
    /**
     * Get currently active object.
     */
    getActive(): IObject | null;
    /**
     * Check if object with specified name exists on canvas.
     */
    has(name: string): boolean;
    /**
     * Select specified object.
     */
    select(objOrId: IObject | string): void;
    /**
     * Deselect currently active object.
     */
    deselectActive(): void;
    /**
     * Apply values to specified or currently active object.
     */
    setValues(values: ObjectOptions, obj?: IObject | null): void;
    /**
     * Move specified or currently active object in given direction.
     */
    move(direction: 'up' | 'right' | 'down' | 'left', amount?: number, obj?: IObject | null): void;
    /**
     * Bring specified or currently active object to front of canvas.
     */
    bringToFront(obj?: IObject | null): void;
    /**
     * Send specified or currently active object to the back of canvas.
     */
    sendToBack(obj?: IObject | null): void;
    /**
     * Flip specified or currently active object horizontally.
     */
    flipHorizontally(obj?: IObject | null): void;
    /**
     * Duplicate specified or currently active object.
     */
    duplicate(obj?: IObject | null): void;
    /**
     * Delete specified or currently active object.
     */
    delete(obj?: IObject | null): void;
    /**
     * Sync layers list with fabric.js objects.
     * @hidden
     */
    syncObjects(): void;
}
