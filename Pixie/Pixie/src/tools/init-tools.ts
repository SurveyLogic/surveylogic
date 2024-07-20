import {initFabric} from '../utils/init-fabric';
import {ZoomTool} from './zoom-tool';
import {PixieCanvas} from './canvas/pixie-canvas';
import {ObjectTool} from '../objects/object-tool';
import {HistoryTool} from './history/history-tool';
import {MergeTool} from './merge/merge-tool';
import {FilterTool} from './filter/filter-tool';
import {ResizeTool} from './resize/resize-tool';
import {CropTool} from './crop/crop-tool';
import {ShapeTool} from './shapes/shape-tool';
import {FrameTool} from './frame/frame-tool';
import {TextTool} from './text/text-tool';
import {DrawTool} from './draw/draw-tool';
import {ImportTool} from './import/import-tool';
import {WatermarkTool} from './export/watermark-tool';
import {ExportTool} from './export/export-tool';
import {useStore} from '../state/store';
import {CornersTool} from './corners/corners-tool';
import {TransformTool} from './transform/transform-tool';
import {state} from '../state/utils';

export interface Tools {
  filter: FilterTool;
  history: HistoryTool;
  objects: ObjectTool;
  canvas: PixieCanvas;
  zoom: ZoomTool;
  resize: ResizeTool;
  crop: CropTool;
  merge: MergeTool;
  shape: ShapeTool;
  frame: FrameTool;
  text: TextTool;
  draw: DrawTool;
  transform: TransformTool;
  import: ImportTool;
  watermark: WatermarkTool;
  export: ExportTool;
  corners: CornersTool;
}

export function initTools(canvasEl: HTMLCanvasElement) {
  const fabric = initFabric(canvasEl);
  state().editor.fabric = fabric;
  useStore.setState({fabric});
  state().editor.tools = {
    canvas: new PixieCanvas(),
    objects: new ObjectTool(),
    zoom: new ZoomTool(),
    history: new HistoryTool(),
    filter: new FilterTool(),
    resize: new ResizeTool(),
    crop: new CropTool(),
    merge: new MergeTool(),
    shape: new ShapeTool(),
    frame: new FrameTool(),
    text: new TextTool(),
    draw: new DrawTool(),
    transform: new TransformTool(),
    import: new ImportTool(),
    watermark: new WatermarkTool(),
    export: new ExportTool(),
    corners: new CornersTool(),
  };
}
