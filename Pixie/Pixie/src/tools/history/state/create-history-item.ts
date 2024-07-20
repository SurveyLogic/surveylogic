import {SerializedPixieState} from '../serialized-pixie-state';
import {HistoryItem} from '../history-item.interface';
import {randomString} from '@common/utils/string/random-string';
import {getCurrentCanvasState} from './get-current-canvas-state';
import {HistoryName} from '../history-display-names';

export function createHistoryItem(params: {
  name: HistoryName;
  state?: SerializedPixieState;
}): HistoryItem {
  if (!params.state) {
    params.state = getCurrentCanvasState();
  }
  const state = params.state || getCurrentCanvasState();
  return {
    ...state,
    name: params.name,
    id: randomString(15),
  };
}
