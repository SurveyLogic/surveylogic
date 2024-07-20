import { SerializedPixieState } from './serialized-pixie-state';
import { HistoryName } from './history-display-names';
export interface HistoryItem extends SerializedPixieState {
    name: HistoryName;
    id: string;
}
