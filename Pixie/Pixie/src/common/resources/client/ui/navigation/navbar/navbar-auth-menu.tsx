import {ReactElement, useContext} from 'react';
import {ListboxItemProps} from '@common/ui/forms/listbox/item';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {useLogout} from '@common/auth/requests/logout';
import {useCustomMenu} from '@common/menus/use-custom-menu';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {useSettings} from '@common/core/settings/use-settings';
import {useAuth} from '@common/auth/use-auth';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {useThemeSelector} from '@common/ui/themes/theme-selector-context';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '@common/ui/navigation/menu/menu-trigger';
import {NotificationsIcon} from '@common/icons/material/Notifications';
import {Trans} from '@common/i18n/trans';
import {PaymentsIcon} from '@common/icons/material/Payments';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {AccountCircleIcon} from '@common/icons/material/AccountCircle';
import {DarkModeIcon} from '@common/icons/material/DarkMode';
import {LightModeIcon} from '@common/icons/material/LightMode';
import {ExitToAppIcon} from '@common/icons/material/ExitToApp';

interface Props {
  children: ReactElement;
  items?: ReactElement<ListboxItemProps>[];
}
export function NavbarAuthMenu({children, items}: Props) {
  const {auth} = useContext(SiteConfigContext);
  const logout = useLogout();
  const menu = useCustomMenu('auth-dropdown');
  const isMobile = useIsMobileMediaQuery();
  const {notifications, themes} = useSettings();
  const {user, isSubscribed} = useAuth();
  const navigate = useNavigate();
  const {selectedTheme, selectTheme} = useThemeSelector();
  if (!selectedTheme || !user) return null;
  const hasUnreadNotif = !!user.unread_notifications_count;

  const notifMenuItem = (
    <MenuItem
      value="notifications"
      startIcon={<NotificationsIcon />}
      onSelected={() => {
        navigate('/notifications');
      }}
    >
      <Trans message="Notifications" />
      {hasUnreadNotif ? ` (${user.unread_notifications_count})` : undefined}
    </MenuItem>
  );

  const billingMenuItem = (
    <MenuItem
      value="billing"
      startIcon={<PaymentsIcon />}
      onSelected={() => {
        navigate('/billing');
      }}
    >
      <Trans message="Billing" />
    </MenuItem>
  );

  return (
    <MenuTrigger>
      {children}
      <Menu>
        {menu &&
          menu.items.map(item => {
            const Icon = item.icon && createSvgIconFromTree(item.icon);
            return (
              <MenuItem
                value={item.id}
                key={item.id}
                startIcon={Icon && <Icon />}
                onSelected={() => {
                  if (item.type === 'link') {
                    window.open(item.action, '_blank');
                  } else {
                    navigate(item.action);
                  }
                }}
              >
                <Trans message={item.label} />
              </MenuItem>
            );
          })}
        {auth.getUserProfileLink && (
          <MenuItem
            value="profile"
            startIcon={<AccountCircleIcon />}
            onSelected={() => {
              navigate(auth.getUserProfileLink!(user));
            }}
          >
            <Trans message="Profile page" />
          </MenuItem>
        )}
        {items?.map(item => item)}
        {isMobile && notifications?.integrated ? notifMenuItem : undefined}
        {isSubscribed && billingMenuItem}
        {themes?.user_change && !selectedTheme.is_dark && (
          <MenuItem
            value="light"
            startIcon={<DarkModeIcon />}
            onSelected={() => {
              selectTheme('dark');
            }}
          >
            <Trans message="Dark mode" />
          </MenuItem>
        )}
        {themes?.user_change && selectedTheme.is_dark && (
          <MenuItem
            value="dark"
            startIcon={<LightModeIcon />}
            onSelected={() => {
              selectTheme('light');
            }}
          >
            <Trans message="Light mode" />
          </MenuItem>
        )}
        <MenuItem
          value="logout"
          startIcon={<ExitToAppIcon />}
          onSelected={() => {
            logout.mutate();
          }}
        >
          <Trans message="Log out" />
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
