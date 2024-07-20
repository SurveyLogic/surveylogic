import {useBootstrapData} from '@common/core/bootstrap-data/bootstrap-data-context';

export function useLightThemeVariables() {
  const {data} = useBootstrapData();
  return data.themes.all.find(theme => !theme.is_dark && theme.default_light)
    ?.colors;
}
