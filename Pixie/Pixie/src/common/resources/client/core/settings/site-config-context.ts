import React, {ComponentType} from 'react';
import type {NotificationListItemProps} from '../../notifications/notification-list';
import {MessageDescriptor} from '../../i18n/message-descriptor';
import {User} from '@common/auth/user';

export interface AdConfig {
  slot: string;
  description: MessageDescriptor;
  image: string;
}

export interface TagType {
  name: string;
  system?: boolean;
}

export interface CustomPageType {
  type: string;
  label: MessageDescriptor;
}

export interface HomepageOption {
  label: MessageDescriptor;
  value: string;
}

export interface SiteConfigContextValue {
  auth: {
    redirectUri: string;
    adminRedirectUri: string;
    getUserProfileLink?: (user: User) => string;
  };
  notifications: {
    renderMap?: Record<string, ComponentType<NotificationListItemProps>>;
  };
  tags: {
    types: TagType[];
  };
  customPages: {
    types: CustomPageType[];
  };
  settings?: {
    showIncomingMailMethod?: boolean;
    showRecaptchaLinkSwitch?: boolean;
  };
  admin: {
    ads: AdConfig[];
  };
  demo: {
    loginPageDefaults: 'singleAccount' | 'randomAccount';
  };
  homepage: {
    options: HomepageOption[];
  };
}

export const SiteConfigContext = React.createContext<SiteConfigContextValue>(
  null!
);
