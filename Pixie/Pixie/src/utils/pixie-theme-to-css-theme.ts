import {PixieTheme} from '../config/default-config';
import {CssTheme} from '@common/ui/themes/css-theme';
import {DEFAULT_THEMES} from '../config/default-themes';
import color from 'color';

export function pixieThemeToCssTheme(theme: PixieTheme): CssTheme {
  const defaultTheme = theme.isDark
    ? DEFAULT_THEMES.find(t => t.isDark)
    : DEFAULT_THEMES.find(t => !t.isDark);

  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme?.colors,
      ...theme.colors,
    },
  };

  const parsedColors = Object.entries(mergedTheme.colors).map(
    ([key, value]) => {
      return [key, parseThemeValue(value)];
    }
  );

  return {
    id: mergedTheme.name,
    name: mergedTheme.name,
    colors: Object.fromEntries(parsedColors),
    is_dark: mergedTheme.isDark,
  };
}

function parseThemeValue(value: string) {
  // opacity or rgb string: 0 0 0
  if (value.endsWith('%') || value.split(' ').length === 3) {
    return value;
  }
  // convert user provided color to rgb string
  return color(value).rgb().array().slice(0, 3).join(' ');
}
