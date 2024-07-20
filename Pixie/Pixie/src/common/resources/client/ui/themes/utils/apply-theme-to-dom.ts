import {CssTheme} from '../css-theme';
import {setThemeColor} from './set-theme-color';
import {rootEl} from '@common/core/root-el';

export function applyThemeToDom(theme: CssTheme) {
  Object.entries(theme.colors).forEach(([key, value]) => {
    setThemeColor(key, value);
  });
  if (theme.is_dark) {
    rootEl.classList.add('dark');
  } else {
    rootEl.classList.remove('dark');
  }
}
