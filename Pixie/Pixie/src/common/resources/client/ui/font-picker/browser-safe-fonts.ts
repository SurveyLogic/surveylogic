import {FontConfig} from '@common/http/value-lists';
import {message} from '@common/i18n/message';

export const BrowserSafeFonts: FontConfig[] = [
  {
    label: message('System'),
    family:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    category: 'sans-serif',
  },
  {family: 'Impact, Charcoal, sans-serif', category: 'sans-serif'},
  {family: 'Arial, Helvetica Neue, Helvetica, sans-serif', category: 'serif'},
  {family: '"Comic Sans MS", cursive, sans-serif', category: 'Handwriting'},
  {family: 'Century Gothic, sans-serif', category: 'sans-serif'},
  {family: '"Courier New", Courier, monospace', category: 'monospace'},
  {
    family: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    category: 'sans-serif',
  },
  {family: '"Times New Roman", Times, serif', category: 'serif'},
  {family: '"Lucida Console", Monaco, monospace', category: 'monospace'},
  {family: '"Andele Mono", monospace, sans-serif', category: 'sans-serif'},
  {family: 'Verdana, Geneva, sans-serif', category: 'sans-serif'},
  {
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    category: 'sans-serif',
  },
];
