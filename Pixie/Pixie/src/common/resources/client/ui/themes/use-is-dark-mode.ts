import {useThemeSelector} from './theme-selector-context';

export function useIsDarkMode(): boolean {
  const {selectedTheme} = useThemeSelector();
  return selectedTheme.is_dark ?? false;
}
