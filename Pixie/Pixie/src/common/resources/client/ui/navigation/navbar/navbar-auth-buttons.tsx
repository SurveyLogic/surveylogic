import {ButtonColor} from '@common/ui/buttons/get-shared-button-style';
import {useSettings} from '@common/core/settings/use-settings';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {Menu, MenuTrigger} from '@common/ui/navigation/menu/menu-trigger';
import {IconButton} from '@common/ui/buttons/icon-button';
import {PersonIcon} from '@common/icons/material/Person';
import {Item} from '@common/ui/forms/listbox/item';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {Button} from '@common/ui/buttons/button';
import {NavbarProps} from '@common/ui/navigation/navbar/navbar';

interface NavbarAuthButtonsProps {
  primaryButtonColor?: ButtonColor;
  navbarColor?: NavbarProps['color'];
}
export function NavbarAuthButtons({
  primaryButtonColor,
  navbarColor,
}: NavbarAuthButtonsProps) {
  const {registration} = useSettings();
  const isMobile = useIsMobileMediaQuery();
  const navigate = useNavigate();

  if (!primaryButtonColor) {
    primaryButtonColor = navbarColor === 'primary' ? 'paper' : 'primary';
  }

  if (isMobile) {
    return (
      <MenuTrigger>
        <IconButton size="md">
          <PersonIcon />
        </IconButton>
        <Menu>
          <Item value="login" onSelected={() => navigate('/login')}>
            <Trans message="Login" />
          </Item>
          {!registration.disable && (
            <Item value="register" onSelected={() => navigate('/register')}>
              <Trans message="Register" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    );
  }

  return (
    <div className="text-sm">
      {!registration.disable && (
        <Button
          elementType={Link}
          to="/register"
          variant="text"
          className="mr-10"
        >
          <Trans message="Register" />
        </Button>
      )}
      <Button
        elementType={Link}
        to="/login"
        variant="raised"
        color={primaryButtonColor}
      >
        <Trans message="Login" />
      </Button>
    </div>
  );
}
