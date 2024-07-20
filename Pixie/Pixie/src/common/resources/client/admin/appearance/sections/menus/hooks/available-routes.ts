import {MenuSectionConfig} from '../../../types/appearance-editor-config';
import {MenuItemConfig} from '../../../../../core/settings/settings';
import mergedAppearanceConfig from '../../../config/merged-appearance-config';

export function useAvailableRoutes(): Partial<MenuItemConfig>[] {
  const menuConfig = mergedAppearanceConfig.sections.menus.config;

  if (!menuConfig) return [];

  return (menuConfig as MenuSectionConfig).availableRoutes.map(route => {
    return {
      id: route,
      label: route,
      action: route,
      type: 'route',
      target: '_self',
    };
  });
}
