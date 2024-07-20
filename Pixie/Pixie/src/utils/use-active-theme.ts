import {useStore} from '../state/store';

export function useActiveTheme() {
  const activeTheme = useStore(s => s.config.ui?.activeTheme);
  return useStore(s =>
    (s.config.ui?.themes || []).find(t => t.name === activeTheme)
  );
}
