import {MenuConfig} from '../core/settings/settings';
import {useAuth} from '../auth/use-auth';
import {useSettings} from '../core/settings/use-settings';

export function useCustomMenu(menuOrPosition?: string | MenuConfig) {
  const settings = useSettings();
  const {user, hasPermission} = useAuth();

  if (!menuOrPosition) {
    return null;
  }

  const menu =
    typeof menuOrPosition === 'string'
      ? settings.menus?.find(s => s.positions?.includes(menuOrPosition))
      : menuOrPosition;

  if (menu) {
    menu.items = menu.items.filter(item => {
      const hasRoles = (item.roles || []).every(a =>
        user?.roles.find(b => b.id === a)
      );
      const hasPermissions = (item.permissions || []).every(a =>
        hasPermission(a)
      );
      // make sure item has action, otherwise router link will error out
      return item.action && hasRoles && hasPermissions;
    });
  }
  return menu;
}
