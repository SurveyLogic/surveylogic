import {InteractableEvent} from '../interactable-event';
import {useEffect, useId, useRef} from 'react';
import {dragMonitors, DragSessionStatus} from './drag-state';
import {ConnectedDraggable} from './use-draggable';

export interface DragMonitor {
  type: string;
  onDragStart?: (e: InteractableEvent, dragTarget: ConnectedDraggable) => void;
  onDragMove?: (e: InteractableEvent, dragTarget: ConnectedDraggable) => void;
  onDragEnd?: (
    e: InteractableEvent,
    dragTarget: ConnectedDraggable,
    status: DragSessionStatus
  ) => void;
}

export function useDragMonitor(monitor: DragMonitor) {
  const monitorRef = useRef(monitor);
  const id = useId();

  useEffect(() => {
    dragMonitors.set(id, monitorRef.current);
    return () => {
      dragMonitors.delete(id);
    };
  }, [id]);
}
