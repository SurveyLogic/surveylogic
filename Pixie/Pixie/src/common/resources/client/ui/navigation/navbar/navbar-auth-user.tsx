import {useAuth} from '@common/auth/use-auth';
import {useThemeSelector} from '@common/ui/themes/theme-selector-context';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {Badge} from '@common/ui/badge/badge';
import {IconButton} from '@common/ui/buttons/icon-button';
import {PersonIcon} from '@common/icons/material/Person';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {ArrowDropDownIcon} from '@common/icons/material/ArrowDropDown';
import {ReactElement} from 'react';
import {ListboxItemProps} from '@common/ui/forms/listbox/item';
import {NavbarAuthMenu} from '@common/ui/navigation/navbar/navbar-auth-menu';

export interface NavbarAuthUserProps {
  items?: ReactElement<ListboxItemProps>[];
}
export function NavbarAuthUser({items = []}: NavbarAuthUserProps) {
  const isMobile = useIsMobileMediaQuery();
  const {user} = useAuth();
  const {selectedTheme} = useThemeSelector();
  if (!selectedTheme || !user) return null;
  const hasUnreadNotif = !!user.unread_notifications_count;

  const mobileButton = (
    <Badge
      badgeLabel={user?.unread_notifications_count}
      badgeIsVisible={hasUnreadNotif}
    >
      <IconButton size="md">
        <PersonIcon />
      </IconButton>
    </Badge>
  );
  const desktopButton = (
    <ButtonBase className="flex items-center">
      <img
        className="w-32 h-32 object-cover flex-shrink-0 rounded mr-12"
        src={user.avatar}
        alt=""
      />
      <span className="block text-sm mr-2 max-w-124 overflow-x-hidden overflow-ellipsis">
        {user.display_name}
      </span>
      <ArrowDropDownIcon className="block icon-sm" />
    </ButtonBase>
  );

  return (
    <NavbarAuthMenu items={items}>
      {isMobile ? mobileButton : desktopButton}
    </NavbarAuthMenu>
  );
}
