import {Settings} from './settings';
import {useBootstrapData} from '../bootstrap-data/bootstrap-data-context';

export function useSettings(): Settings {
  const {
    data: {settings},
  } = useBootstrapData();
  return settings;
}
