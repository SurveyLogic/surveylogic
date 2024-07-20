import deepMerge from 'deepmerge';
import {DefaultAppearanceConfig} from '@common/admin/appearance/config/default-appearance-config';
import {AppAppearanceConfig} from '@app/admin/appearance/app-appearance-config';
import {IAppearanceConfig} from '@common/admin/appearance/types/appearance-editor-config';

const mergedAppearanceConfig = deepMerge.all([
  DefaultAppearanceConfig,
  AppAppearanceConfig,
]);

export default mergedAppearanceConfig as IAppearanceConfig;
