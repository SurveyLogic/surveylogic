import { Object as IObject } from 'fabric/fabric-impl';
import { ToolName } from '@app/tools/tool-name';
import { ActiveToolOverlay } from '@app/state/editor-state';
export declare function setActiveTool(name?: ToolName | null): void;
export declare function getToolForObj(obj?: IObject | null): [ToolName | null, ActiveToolOverlay | null];
