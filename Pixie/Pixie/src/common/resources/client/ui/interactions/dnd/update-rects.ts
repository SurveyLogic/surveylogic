// use intersection observer instead of getBoundingClientRect for better performance as this will be called in onPointerMove event
import {InteractableRect} from '../interactable-event';
import {ConnectedMouseSelectable} from './mouse-selection/use-mouse-selectable';
import {DraggableId} from './use-draggable';
import {ConnectedDroppable} from './use-droppable';

export function updateRects(
  targets: Map<DraggableId, ConnectedDroppable | ConnectedMouseSelectable>
) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const {width, height, left, top} = entry.boundingClientRect;
      const [id, target] =
        [...targets].find(
          ([, target]) => target.ref.current === entry.target
        ) || [];
      if (id == null || target == null) return;

      const rect: InteractableRect = {
        width,
        height,
        left,
        top,
      };
      targets.set(id, {...target, rect});
    });
    observer.disconnect();
  });

  [...targets.values()].forEach(target => {
    if (target.ref.current) {
      observer.observe(target.ref.current);
    }
  });
}
