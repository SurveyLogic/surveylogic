import {useValueLists} from '../http/value-lists';
import {Button} from '../ui/buttons/button';
import {LanguageIcon} from '../icons/material/Language';
import {KeyboardArrowDownIcon} from '../icons/material/KeyboardArrowDown';
import {useSelectedLocale} from './selected-locale';
import {Menu, MenuItem, MenuTrigger} from '../ui/navigation/menu/menu-trigger';
import {useChangeLocale} from './change-locale';
import {useSettings} from '../core/settings/use-settings';

export function LocaleSwitcher() {
  const {locale} = useSelectedLocale();
  const changeLocale = useChangeLocale();
  const {data} = useValueLists(['localizations']);
  const {i18n} = useSettings();

  if (!data?.localizations || !locale || !i18n.enable) return null;

  return (
    <MenuTrigger
      floatingWidth="matchTrigger"
      selectionMode="single"
      selectedValue={locale.language}
      onSelectionChange={value => {
        const newLocale = value as string;
        if (newLocale !== locale?.language) {
          changeLocale.mutate({locale: newLocale});
        }
      }}
    >
      <Button
        disabled={changeLocale.isLoading}
        className="capitalize"
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {locale.name}
      </Button>
      <Menu>
        {data.localizations.map(localization => (
          <MenuItem
            value={localization.language}
            key={localization.language}
            className="capitalize"
          >
            {localization.name}
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
