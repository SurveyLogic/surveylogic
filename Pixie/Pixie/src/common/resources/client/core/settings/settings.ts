import {IconTree} from '../../icons/create-svg-icon';

export type RecaptchaAction = 'contact' | 'register' | 'link_creation';

export interface Settings {
  version: string;
  branding: {
    logo_light: string;
    logo_dark: string;
    logo_light_mobile: string;
    logo_dark_mobile: string;
    site_name: string;
    site_description: string;
    favicon: string;
  };
  menus: MenuConfig[];
  base_url: string;
  html_base_uri: string;
  cookie_notice: {
    enable: boolean;
    position: 'top' | 'bottom';
    button?: MenuItemConfig;
  };
  logging: {
    sentry_public?: string;
  };
  themes: {
    default_id?: number | string | null;
    user_change: boolean;
  };
  custom_domains?: {
    default_host?: string;
    allow_select?: boolean;
    allow_all_option?: boolean;
  };
  dates: {
    format: string;
    default_timezone: string;
  };
  i18n: {
    enable: boolean;
    default_localization: string;
  };
  api?: {
    integrated: boolean;
  };
  billing: {
    enable: boolean;
    accepted_cards?: string | string[];
    paypal_test_mode: boolean;
    stripe_public_key?: string;
    invoice: {
      address?: string;
      notes?: string;
    };
    paypal: {
      public_key: string;
      enable: boolean;
    };
    stripe: {
      enable: boolean;
    };
  };
  notifications: {
    integrated: boolean;
  };
  notif: {
    subs: {
      integrated: boolean;
    };
  };
  site: {
    hide_docs_button: boolean;
    has_mobile_app: boolean;
    demo: boolean;
  };
  registration: {
    disable: boolean;
    policies?: MenuItemConfig[];
  };
  social: {
    envato: {
      enable: boolean;
    };
    google: {
      enable: boolean;
    };
    twitter: {
      enable: boolean;
    };
    facebook: {
      enable: boolean;
    };
    compact_buttons: boolean;
  };
  workspaces: {
    integrated: boolean;
  };
  uploads: {
    chunk_size: number;
    max_size: number;
    available_space: number;
    allowed_extensions?: string[];
    blocked_extensions?: string[];
    public_driver: string;
    uploads_driver: string;
    s3_direct_upload: boolean;
    disable_tus: boolean;
  };
  require_email_confirmation: boolean;
  single_device_login: boolean;
  mail: {
    contact_page_address: string;
    handler: string;
  };
  recaptcha?: {
    enable?: Record<RecaptchaAction, boolean>;
    site_key: string;
  };
  analytics?: {
    tracking_code?: string;
    gchart_api_key?: string;
  };
  envato: {
    enable: boolean;
  };
}

export interface MenuConfig {
  id: string;
  name: string;
  positions: string[];
  items: MenuItemConfig[];
}

export interface MenuItemConfig {
  id: string;
  type: 'route' | 'link';
  order: number;
  label: string;
  action: string;
  target?: '_blank' | '_self';
  roles?: number[];
  permissions?: string[];
  icon?: IconTree[] | null;
}
