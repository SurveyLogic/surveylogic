import {EditorTheme} from './editor-theme';
import type {PixieTheme} from './default-config';

export const DEFAULT_THEMES: PixieTheme[] = [
  {
    name: EditorTheme.LIGHT,
    colors: {
      '--be-foreground-base': '0 0 0',
      '--be-primary-light': '191 219 254', // 200
      '--be-primary': '59 130 246', // 500
      '--be-primary-dark': '37 99 235',
      '--be-on-primary': '255 255 255',
      '--be-danger': '179 38 30',
      '--be-on-danger': '255 255 255',
      '--be-background': '255 255 255',
      '--be-background-alt': '250 250 250',
      '--be-paper': '255 255 255',
      '--be-disabled-bg-opacity': '12%',
      '--be-disabled-fg-opacity': '26%',
      '--be-hover-opacity': '4%',
      '--be-focus-opacity': '12%',
      '--be-selected-opacity': '8%',
      '--be-text-main-opacity': '87%',
      '--be-text-muted-opacity': '60%',
      '--be-divider-opacity': '12%',
    },
  },
  {
    name: EditorTheme.DARK,
    isDark: true,
    colors: {
      '--be-foreground-base': '255 255 255',
      '--be-primary-light': '239 246 255', // 50
      '--be-primary': '191 219 254', // 200
      '--be-primary-dark': '147 197 253', // 300
      '--be-on-primary': '56 30 114',
      '--be-danger': '242 184 181',
      '--be-on-danger': '96 20 16',
      '--be-background': '20 21 23',
      '--be-background-alt': '26 27 30',
      '--be-paper': '44 46 51',
      '--be-disabled-bg-opacity': '12%',
      '--be-disabled-fg-opacity': '30%',
      '--be-hover-opacity': '8%',
      '--be-focus-opacity': '12%',
      '--be-selected-opacity': '16%',
      '--be-text-main-opacity': '100%',
      '--be-text-muted-opacity': '70%',
      '--be-divider-opacity': '12%',
    },
  },
];
