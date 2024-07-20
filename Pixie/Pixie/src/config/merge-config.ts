import deepmerge from 'deepmerge';
import {PixieConfig} from './default-config';
import {lowerFirst} from '@common/utils/string/lower-first';

export function mergeConfig(
  userConfig: Partial<PixieConfig>,
  currentConfig: PixieConfig
): PixieConfig {
  const merged = deepmerge(currentConfig, userConfig);
  return replaceDefaultConfigItems(merged, userConfig) as PixieConfig;
}

function replaceDefaultConfigItems(
  config: Record<string, any>,
  userConfig: Record<string, any> | undefined
) {
  Object.keys(config).forEach(key => {
    if (key.startsWith('replaceDefault') && config[key]) {
      // "replaceDefaultSamples" => "samples" or just "items"
      const iterablesKey = lowerFirst(
        key.replace('replaceDefault', '') || 'items'
      );
      config[iterablesKey] = userConfig ? userConfig[iterablesKey] : [];
      // remove passed in "replaceDefaultItems" option, so
      // it does not cause issues on subsequent config merged
      delete config[key];
    } else if (typeof config[key] === 'object' && config[key] !== null) {
      replaceDefaultConfigItems(config[key], userConfig?.[key]);
    }
  });
  return config;
}
