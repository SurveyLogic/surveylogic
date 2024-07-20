import {createContext, useContext} from 'react';
import {CssTheme} from './css-theme';

export type ThemeId = 'light' | 'dark' | number;

export interface ThemeSelectorContextValue {
  allThemes: CssTheme[];
  selectedTheme: CssTheme;
  selectTheme: (themeId: ThemeId) => void;
}

export const ThemeSelectorContext = createContext<ThemeSelectorContextValue>(
  null!
);

export function useThemeSelector() {
  return useContext(ThemeSelectorContext);
}
