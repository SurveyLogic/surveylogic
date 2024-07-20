import {DragMonitor} from './use-drag-monitor';
import {ConnectedDraggable, DraggableId} from './use-draggable';
import {ConnectedDroppable} from './use-droppable';

export type DragSessionStatus =
  | 'dropSuccess'
  | 'dropFail'
  | 'dragging'
  | 'inactive';

export interface DragSession {
  dragTargetId?: DraggableId;
  status: DragSessionStatus;
}

export const draggables = new Map<DraggableId, ConnectedDraggable>();
export const droppables = new Map<DraggableId, ConnectedDroppable>();
export const dragMonitors = new Map<DraggableId, DragMonitor>();
export const dragSession: DragSession = {
  status: 'inactive',
};
