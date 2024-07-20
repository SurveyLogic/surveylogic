import {Canvas} from 'fabric/fabric-impl';
import type {Pixie} from '../pixie';
import type {PixieConfig} from '../config/default-config';
import type {PlainRect} from '@common/utils/dom/get-bounding-client-rect';
import type {ToolName} from '../tools/tool-name';
import {RefObject} from 'react';
import {BootstrapData} from '@common/core/bootstrap-data/bootstrap-data';

export type LoadingType = 'newCanvas' | 'mainImage' | 'state' | 'merge' | false;

export enum ActiveToolOverlay {
  Filter = 'filter',
  Frame = 'frame',
  ActiveObject = 'activeObj',
  Text = 'text',
}

export type EditorState = {
  editor: Pixie;
  fabric: Canvas;
  config: PixieConfig;
  setConfig: (partialConfig: Partial<PixieConfig>) => void;
  bootstrapData: Partial<BootstrapData>;
  loading: LoadingType;
  openPanels: {
    newImage: boolean;
    history: boolean;
    objects: boolean;
    export: boolean;
  };
  zoom: number;
  // original width and height, either size of main image or user selected
  original: {
    width: number;
    height: number;
  };
  stageSize: PlainRect;
  canvasSize: PlainRect;
  setCanvasSize: (size: PlainRect) => void;
  canvasRef: RefObject<HTMLElement> | null;
  activeTool: ToolName | null;
  activeToolOverlay: ActiveToolOverlay | null;
  dirty: boolean;

  cancelChanges: () => void;
  applyChanges: () => void;
  setZoom: (zoom: number) => void;
  setOriginal: (width: number, height: number) => void;
  setDirty: (isDirty: boolean) => void;
  toggleLoading: (loading: LoadingType) => void;
  setStageSize: (size: PlainRect) => void;
  togglePanel: (
    name: keyof EditorState['openPanels'],
    isOpen?: boolean
  ) => void;
  setActiveTool: (
    tool: ToolName | null,
    overlay: ActiveToolOverlay | null
  ) => void;
  reset: () => void;
};
