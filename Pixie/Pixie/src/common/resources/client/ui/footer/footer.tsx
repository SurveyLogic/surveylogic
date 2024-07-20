import clsx from 'clsx';
import {CustomMenu} from '../../menus/custom-menu';
import {LocaleSwitcher} from '../../i18n/locale-switcher';
import {Button} from '../buttons/button';
import {DarkModeIcon} from '../../icons/material/DarkMode';
import {LightbulbIcon} from '../../icons/material/Lightbulb';
import {Trans} from '../../i18n/trans';
import {useThemeSelector} from '../themes/theme-selector-context';
import {useSettings} from '../../core/settings/use-settings';

interface Props {
  className?: string;
  padding?: string;
}

export function Footer({className, padding}: Props) {
  const year = new Date().getFullYear();
  return (
    <footer
      className={clsx(
        'text-sm',
        padding ? padding : 'pt-54 pb-28 md:pb-54',
        className
      )}
    >
      <Menus />
      <div className="md:flex md:text-left text-center items-center gap-30 justify-between text-muted">
        <Trans
          message="Copyright © :year, All Rights Reserved"
          values={{year}}
        />
        <div>
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}

function Menus() {
  const settings = useSettings();
  const primaryMenu = settings.menus.find(m => m.positions?.includes('footer'));
  const secondaryMenu = settings.menus.find(m =>
    m.positions?.includes('footer-secondary')
  );

  if (!primaryMenu && !secondaryMenu) return null;

  return (
    <div className="md:flex items-center justify-between overflow-x-auto border-b pb-14 mb-14 gap-30">
      {primaryMenu && (
        <CustomMenu menu={primaryMenu} className="text-primary" />
      )}
      {secondaryMenu && (
        <CustomMenu menu={secondaryMenu} className="text-muted mt-14 mb:mt-0" />
      )}
    </div>
  );
}

function ThemeSwitcher() {
  const {themes} = useSettings();
  const {selectedTheme, selectTheme} = useThemeSelector();
  if (!selectedTheme || !themes?.user_change) return null;

  return (
    <Button
      variant="text"
      startIcon={selectedTheme.is_dark ? <DarkModeIcon /> : <LightbulbIcon />}
      onClick={() => {
        if (selectedTheme.is_dark) {
          selectTheme('light');
        } else {
          selectTheme('dark');
        }
      }}
    >
      {selectedTheme.is_dark ? (
        <Trans message="Dark mode" />
      ) : (
        <Trans message="Light mode" />
      )}
    </Button>
  );
}
