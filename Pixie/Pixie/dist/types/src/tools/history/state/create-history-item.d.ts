import { SerializedPixieState } from '../serialized-pixie-state';
import { HistoryItem } from '../history-item.interface';
import { HistoryName } from '../history-display-names';
export declare function createHistoryItem(params: {
    name: HistoryName;
    state?: SerializedPixieState;
}): HistoryItem;
