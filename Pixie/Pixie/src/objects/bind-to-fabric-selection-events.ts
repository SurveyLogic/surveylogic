import {IEvent, Object as IObject} from 'fabric/fabric-impl';
import {getToolForObj, setActiveTool} from '../ui/navbar/set-active-tool';
import {state, tools} from '../state/utils';
import {ToolName} from '../tools/tool-name';

interface SelectionEvent extends IEvent {
  deselected?: IObject[];
}

export function bindToFabricSelectionEvents() {
  state().fabric.on('selection:created', e => {
    if (e.selected?.[0] && !shouldPreventObjDeselect(e)) {
      selectNewObj(e.selected[0]);
    }
  });
  state().fabric.on('selection:updated', e => {
    if (!shouldPreventObjDeselect(e)) {
      selectNewObj(e.selected?.[0]);
    }
  });
  state().fabric.on('selection:cleared', () => {
    selectNewObj();
  });
}

function shouldPreventObjDeselect(e: SelectionEvent): boolean {
  const [toolName] = getToolForObj(e.selected?.[0]);
  const objIsHandledByActiveTool = toolName === state().activeTool;
  if (state().dirty && (!e.selected?.[0] || !objIsHandledByActiveTool)) {
    if (e.deselected) {
      tools().objects.select(e.deselected[0]);
    }
    return true;
  }
  return false;
}

function selectNewObj(obj?: IObject) {
  if (obj?.data.id === state().objects.active.id) {
    return;
  }
  state().objects.setActive(obj ?? null);

  // prevent draw tool from closing when deselecting an object
  if (state().activeTool !== ToolName.DRAW) {
    setActiveTool();
  }
}
