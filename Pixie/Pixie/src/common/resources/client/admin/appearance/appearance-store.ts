import {create} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {Settings} from '../../core/settings/settings';
import type {IAppearanceConfig} from './types/appearance-editor-config';
import {AllCommands} from './commands/commands';
import mergedAppearanceConfig from './config/merged-appearance-config';
import {BootstrapData} from '../../core/bootstrap-data/bootstrap-data';

export interface AppearanceValues {
  appearance: {
    env: {app_name: string; app_url: string};
    seo: {
      key: string;
      name: string;
      value: string;
      defaultValue: string;
    }[];
    themes: BootstrapData['themes'];
    custom_code: {
      css?: string;
      html?: string;
    };
  };
  settings: Settings;
}

export interface AppearanceDefaults {
  appearance: {
    themes: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
  };
  settings: Settings;
}

interface AppearanceStore {
  defaults: AppearanceDefaults | null;
  iframeWindow: Window | null;
  config: IAppearanceConfig | null;
  setDefaults: (value: AppearanceDefaults) => void;
  setIframeWindow: (value: Window) => void;
  preview: {
    navigate: (sectionName: string) => void;
    setValues: (settings: AppearanceValues) => void;
    setThemeColor: (name: string, value: string) => void;
    setActiveTheme: (themeId: number | string) => void;
    setHighlight: (selector: string | null | undefined) => void;
    setCustomCode: (mode: 'css' | 'html', value?: string) => void;
  };
}

export const useAppearanceStore = create<AppearanceStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      defaults: null,
      iframeWindow: null,
      config: mergedAppearanceConfig,
      setDefaults: value => {
        set(state => {
          state.defaults = {...value};
        });
      },
      setIframeWindow: value => {
        set(() => {
          return {iframeWindow: value};
        });
      },

      preview: {
        navigate: sectionName => {
          const section = get().config?.sections[sectionName];
          const route = section?.previewRoute || '/';
          const preview = get().iframeWindow;
          if (route) {
            postMessage(preview, {type: 'navigate', to: route});
          }
        },
        setValues: values => {
          const preview = get().iframeWindow;
          postMessage(preview, {type: 'setValues', values});
        },
        setThemeColor: (name, value) => {
          const preview = get().iframeWindow;
          postMessage(preview, {type: 'setThemeColor', name, value});
        },
        setActiveTheme: themeId => {
          const preview = get().iframeWindow;
          postMessage(preview, {type: 'setActiveTheme', themeId});
        },
        setCustomCode: (mode, value) => {
          const preview = get().iframeWindow;
          postMessage(preview, {type: 'setCustomCode', mode, value});
        },
        setHighlight: selector => {
          set(() => {
            let node: HTMLElement | null = null;
            const document = get().iframeWindow?.document;
            if (document && selector) {
              node = document.querySelector(selector);
            }
            if (node) {
              requestAnimationFrame(() => {
                if (!node) return;
                node.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'center',
                });
              });
            }
          });
        },
      },
    }))
  )
);

function postMessage(window: Window | null, command: AllCommands) {
  if (window) {
    window.postMessage({source: 'be-appearance-editor', ...command}, '*');
  }
}

export function appearanceState() {
  return useAppearanceStore.getState();
}
