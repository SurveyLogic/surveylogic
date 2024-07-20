import {ReactElement, ReactNode} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';
import {NotificationDialogTrigger} from '@common/notifications/dialog/notification-dialog-trigger';
import {Menu, MenuTrigger} from '@common/ui/navigation/menu/menu-trigger';
import {useCustomMenu} from '@common/menus/use-custom-menu';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {useTrans} from '@common/i18n/use-trans';
import {Trans} from '@common/i18n/trans';
import {IconButton} from '@common/ui/buttons/icon-button';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {Item} from '@common/ui/forms/listbox/item';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import {CustomMenu} from '@common/menus/custom-menu';
import {useSettings} from '@common/core/settings/use-settings';
import {ButtonColor} from '@common/ui/buttons/get-shared-button-style';
import {MenuIcon} from '@common/icons/material/Menu';
import {MenuItemConfig} from '@common/core/settings/settings';
import {
  NavbarAuthUser,
  NavbarAuthUserProps,
} from '@common/ui/navigation/navbar/navbar-auth-user';
import {NavbarAuthButtons} from '@common/ui/navigation/navbar/navbar-auth-buttons';

type NavbarColor = 'primary' | 'bg' | 'bg-alt' | 'transparent' | string;

export interface NavbarProps {
  hideLogo?: boolean;
  toggleButton?: ReactElement;
  children?: ReactNode;
  className?: string;
  color?: NavbarColor;
  darkModeColor?: NavbarColor;
  logoColor?: 'dark' | 'light';
  textColor?: string;
  primaryButtonColor?: ButtonColor;
  border?: string;
  size?: 'xs' | 'sm' | 'md';
  rightChildren?: ReactNode;
  menuPosition?: string;
  authMenuItems?: NavbarAuthUserProps['items'];
}
export function Navbar(props: NavbarProps) {
  let {
    hideLogo,
    toggleButton,
    children,
    className,
    border,
    size = 'md',
    color = 'primary',
    textColor,
    darkModeColor = 'bg-alt',
    rightChildren,
    menuPosition,
    logoColor,
    primaryButtonColor,
    authMenuItems,
  } = props;
  const isMobile = useIsMobileMediaQuery();
  const isDarkMode = useIsDarkMode();
  const {notifications} = useSettings();
  const {isLoggedIn} = useAuth();

  const showNotifButton = !isMobile && isLoggedIn && notifications?.integrated;

  if (isDarkMode) {
    color = darkModeColor;
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-10 py-8',
        isMobile ? 'pl-14 pr-8' : 'px-20',
        getColorStyle(color, textColor),
        size === 'md' && 'h-64 py-8',
        size === 'sm' && 'h-54 py-4',
        size === 'xs' && 'h-48 py-4',
        border,
        className
      )}
    >
      {!hideLogo && (
        <Logo isMobile={isMobile} color={color} logoColor={logoColor} />
      )}
      {toggleButton}
      {children}
      {isMobile ? (
        <MobileMenu position={menuPosition} />
      ) : (
        <DesktopMenu position={menuPosition} />
      )}
      <div
        className={clsx(
          'ml-auto flex items-center',
          isMobile ? 'gap-4' : 'gap-14'
        )}
      >
        {rightChildren}
        {showNotifButton && <NotificationDialogTrigger />}
        {isLoggedIn ? (
          <NavbarAuthUser items={authMenuItems} />
        ) : (
          <NavbarAuthButtons
            navbarColor={color}
            primaryButtonColor={primaryButtonColor}
          />
        )}
      </div>
    </div>
  );
}

interface DesktopMenuProps {
  position: NavbarProps['menuPosition'];
}
function DesktopMenu({position}: DesktopMenuProps) {
  return (
    <CustomMenu
      className="text-sm mx-14"
      itemClassName={isActive =>
        clsx(
          'opacity-90 hover:underline hover:opacity-100',
          isActive && 'opacity-100'
        )
      }
      menu={position}
    />
  );
}

interface MobileMenuProps {
  position: NavbarProps['menuPosition'];
}
function MobileMenu({position}: MobileMenuProps) {
  const navigate = useNavigate();
  const menu = useCustomMenu(position);

  if (!menu?.items.length) {
    return null;
  }

  const handleItemClick = (item: MenuItemConfig) => {
    if (item.type === 'route') {
      navigate(item.action);
    } else {
      window.open(item.action, item.target)?.focus();
    }
  };

  return (
    <MenuTrigger>
      <IconButton>
        <MenuIcon />
      </IconButton>
      <Menu>
        {menu.items.map(item => {
          const Icon = item.icon && createSvgIconFromTree(item.icon);
          return (
            <Item
              value={item.action}
              onSelected={() => handleItemClick(item)}
              key={item.id}
              startIcon={Icon && <Icon />}
            >
              <Trans message={item.label} />
            </Item>
          );
        })}
      </Menu>
    </MenuTrigger>
  );
}

interface LogoProps {
  isMobile: boolean | null;
  color: NavbarProps['color'];
  logoColor: NavbarProps['logoColor'];
}
function Logo({color, isMobile, logoColor}: LogoProps) {
  const {trans} = useTrans();
  const {branding} = useSettings();
  const isDarkMode = useIsDarkMode();

  let desktopLogo: string;
  let mobileLogo: string;
  if (
    isDarkMode ||
    !branding.logo_dark ||
    (logoColor !== 'dark' && color !== 'bg' && color !== 'bg-alt')
  ) {
    desktopLogo = branding.logo_light;
    mobileLogo = branding.logo_light_mobile;
  } else {
    desktopLogo = branding.logo_dark;
    mobileLogo = branding.logo_dark_mobile;
  }

  const logoUrl = isMobile ? mobileLogo || desktopLogo : desktopLogo;
  if (!logoUrl) {
    return null;
  }

  return (
    <Link
      to="/"
      className={clsx(
        'block mr-4 md:mr-24 flex-shrink-0 h-full',
        isMobile ? 'max-h-26' : 'max-h-36'
      )}
      aria-label={trans({message: 'Go to homepage'})}
    >
      <img
        className="block w-auto h-full"
        data-logo="navbar"
        src={logoUrl}
        alt={trans({message: 'Site logo'})}
      />
    </Link>
  );
}

function getColorStyle(color: string, textColor?: string): string {
  switch (color) {
    case 'primary':
      return `bg-primary ${textColor || 'text-on-primary'} border-b-primary`;
    case 'bg':
      return `bg ${textColor || 'text-main'} border-b`;
    case 'bg-alt':
      return `bg-alt ${textColor || 'text-main'} border-b`;
    case 'transparent':
      return `bg-transparent ${textColor || 'text-white'}`;
    default:
      return `${color} ${textColor}`;
  }
}
