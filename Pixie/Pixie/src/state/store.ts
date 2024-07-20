import {create, GetState} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import {castDraft, Draft} from 'immer';
import {DEFAULT_CONFIG} from '../config/default-config';
import {mergeConfig} from '../config/merge-config';
import {
  createHistorySlice,
  HistorySlice,
} from '../tools/history/state/history-slice';
import {createFilterSlice, FilterSlice} from '../tools/filter/filter-slice';
import {createCropSlice, CropSlice} from '../tools/crop/crop-slice';
import {createObjectsSlice, ObjectsSlice} from '../objects/state/objects-slice';
import {createFrameSlice, FrameSlice} from '../tools/frame/frame-slice';
import {
  createResizeSlice,
  ResizeSlice,
} from '../tools/resize/state/resize-slice';
import {EditorState} from './editor-state';
import {CornersSlice, createCornersSlice} from '../tools/corners/corners-slice';
import {immer} from 'zustand/middleware/immer';
import {PlainRect} from '@common/utils/dom/get-bounding-client-rect';
import {pixieThemeToCssTheme} from '../utils/pixie-theme-to-css-theme';
import {applyThemeToDom} from '@common/ui/themes/utils/apply-theme-to-dom';

export type StoreSlice<T> = (
  set: (
    partial: ((draft: Draft<PixieState>) => void) | Partial<PixieState>,
    replace?: boolean
  ) => void,
  get: GetState<PixieState>
) => T;

export type PixieState = EditorState &
  HistorySlice &
  ObjectsSlice &
  FilterSlice &
  CropSlice &
  FrameSlice &
  ResizeSlice &
  CornersSlice;

const EMPTY_PLAIN_RECT: PlainRect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

export const useStore = create<PixieState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      editor: null!,
      fabric: null!,
      bootstrapData: {},
      config: DEFAULT_CONFIG,
      zoom: 1,
      dirty: false,
      original: {
        width: 1,
        height: 1,
      },
      stageSize: EMPTY_PLAIN_RECT,
      canvasSize: EMPTY_PLAIN_RECT,
      canvasRef: null,
      activeTool: null,
      activeToolOverlay: null,
      loading: false,
      openPanels: {
        newImage: false,
        history: false,
        objects: false,
        export: false,
      },
      ...createHistorySlice(set, get),
      ...createObjectsSlice(set, get),
      ...createFilterSlice(set, get),
      ...createCropSlice(set, get),
      ...createFrameSlice(set, get),
      ...createResizeSlice(set, get),
      ...createCornersSlice(set, get),

      // actions
      setZoom: newZoom =>
        set(state => {
          state.zoom = newZoom;
        }),
      setOriginal: (width, height) =>
        set(state => {
          state.original = {width, height};
        }),
      setDirty: isDirty =>
        set(state => {
          state.dirty = isDirty;
        }),
      toggleLoading: isLoading =>
        set(state => {
          state.loading = isLoading;
        }),
      setStageSize: size =>
        set(state => {
          state.stageSize = size;
        }),
      setCanvasSize: size =>
        set(state => {
          state.canvasSize = size;
        }),
      setActiveTool: (toolName, overlay) => {
        set(state => {
          state.activeTool = toolName;
          state.activeToolOverlay = overlay;
        });
      },
      setConfig: partialConfig =>
        set(state => {
          // set merged config in the store
          const mergedConfig = mergeConfig(partialConfig, get().config);
          state.config = castDraft(mergedConfig);

          // get values from merged config and not from state to avoid stale values
          const language = mergedConfig.activeLanguage || 'en';
          const lines = mergedConfig.languages?.[language];
          const themes = (mergedConfig.ui?.themes || []).map(theme =>
            pixieThemeToCssTheme(theme)
          );

          // set css variables from changed theme
          const activeTheme = themes.find(
            t => t.id === mergedConfig.ui?.activeTheme
          );
          if (activeTheme) {
            applyThemeToDom(activeTheme);
          }

          // set bootstrap data needed for common components
          state.bootstrapData = {
            i18n: {language, name: language, id: 0, lines},
            themes: {
              all: themes,
            },
          };
        }),
      togglePanel: (panelName, isOpen) =>
        set(state => {
          state.openPanels[panelName] = isOpen ?? !state.openPanels[panelName];
        }),

      applyChanges: async () => {
        const activeToolName = get().activeTool;
        if (!activeToolName) return;

        // @ts-ignore
        const toolSlice = get()[activeToolName];

        const result = await toolSlice?.apply?.();

        set(state => {
          state.dirty = false;
          state.activeTool = null;
          state.activeToolOverlay = null;
        });

        // allow tools to prevent history item addition
        if (result !== false) {
          get().editor.tools.history.addHistoryItem({name: activeToolName});
        }

        toolSlice?.reset();
      },
      cancelChanges: async () => {
        const activeToolName = get().activeTool;
        if (!activeToolName) return;

        const wasDirty = get().dirty;

        set(state => {
          state.dirty = false;
          state.activeTool = null;
          state.activeToolOverlay = null;
        });

        if (wasDirty) {
          await get().editor.tools.history.reload();
        }

        // @ts-ignore
        const toolSlice = get()[activeToolName];

        // run reset after history is loaded so too state can perform any needed changes.
        // Removing straighten anchor for example.
        toolSlice?.reset();
      },
      reset: () => {
        get().editor.tools.transform.resetStraightenAnchor();
        set({
          activeTool: null,
          activeToolOverlay: null,
          zoom: 1,
          dirty: false,
          loading: false,
          openPanels: {
            newImage: false,
            history: false,
            objects: false,
            export: false,
          },
        });
        get().history.reset();
        get().objects.reset();
        get().filter.reset();
        get().crop.reset();
        get().frame.reset();
        get().resize.reset();
        get().corners.reset();
      },
    }))
  )
);
