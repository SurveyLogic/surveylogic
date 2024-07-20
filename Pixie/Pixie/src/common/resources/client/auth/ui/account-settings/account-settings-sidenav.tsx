import {List, ListItem} from '@common/ui/list/list';
import {PersonIcon} from '@common/icons/material/Person';
import {Trans} from '@common/i18n/trans';
import {LoginIcon} from '@common/icons/material/Login';
import {LockIcon} from '@common/icons/material/Lock';
import {PhonelinkLockIcon} from '@common/icons/material/PhonelinkLock';
import {LanguageIcon} from '@common/icons/material/Language';
import {ApiIcon} from '@common/icons/material/Api';
import {DangerousIcon} from '@common/icons/material/Dangerous';
import {ReactNode} from 'react';
import {DevicesIcon} from '@common/icons/material/Devices';

export enum AccountSettingsId {
  AccountDetails = 'account-details',
  SocialLogin = 'social-login',
  Password = 'password',
  TwoFactor = 'two-factor',
  LocationAndLanguage = 'location-and-language',
  Developers = 'developers',
  DeleteAccount = 'delete-account',
  Sessions = 'sessions',
}

export function AccountSettingsSidenav() {
  const p = AccountSettingsId;
  return (
    <aside className="flex-shrink-0 sticky top-10 hidden lg:block">
      <List padding="p-0">
        <Item icon={<PersonIcon />} panel={p.AccountDetails}>
          <Trans message="Account details" />
        </Item>
        <Item icon={<LoginIcon />} panel={p.SocialLogin}>
          <Trans message="Social login" />
        </Item>
        <Item icon={<LockIcon />} panel={p.Password}>
          <Trans message="Password" />
        </Item>
        <Item icon={<PhonelinkLockIcon />} panel={p.TwoFactor}>
          <Trans message="Two factor authentication" />
        </Item>
        <Item icon={<DevicesIcon />} panel={p.Sessions}>
          <Trans message="Active sessions" />
        </Item>
        <Item icon={<LanguageIcon />} panel={p.LocationAndLanguage}>
          <Trans message="Location and language" />
        </Item>
        <Item icon={<ApiIcon />} panel={p.Developers}>
          <Trans message="Developers" />
        </Item>
        <Item icon={<DangerousIcon />} panel={p.DeleteAccount}>
          <Trans message="Delete account" />
        </Item>
      </List>
    </aside>
  );
}

interface ItemProps {
  children: ReactNode;
  icon: ReactNode;
  isLast?: boolean;
  panel: AccountSettingsId;
}
function Item({children, icon, isLast, panel}: ItemProps) {
  return (
    <ListItem
      startIcon={icon}
      className={isLast ? undefined : 'mb-10'}
      onSelected={() => {
        const panelEl = document.querySelector(`#${panel}`);
        if (panelEl) {
          panelEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }}
    >
      {children}
    </ListItem>
  );
}
