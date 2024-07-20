import {CssTheme} from '../../ui/themes/css-theme';
import {Settings} from '../settings/settings';
import {User} from '../../auth/user';
import {Role} from '../../auth/role';
import {Localization} from '../../i18n/localization';
import {MetaTag} from '../../seo/meta-tag';

export interface BootstrapData {
  themes: {all: CssTheme[]; selectedThemeId?: number | string | null};
  settings: Settings;
  user: User | null;
  guest_role: Role | null;
  i18n: Localization;
  default_meta_tags: MetaTag[];
  show_cookie_notice: boolean;
}
