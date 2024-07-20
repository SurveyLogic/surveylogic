import {Link} from 'react-router-dom';
import {CustomMenu} from '../../../menus/custom-menu';
import {useSettings} from '../../../core/settings/use-settings';

export function AuthLayoutFooter() {
  const {branding} = useSettings();
  return (
    <div className="pt-42 pb-32 flex items-center gap-30 text-sm text-muted mt-auto">
      <Link className="hover:text-fg-base transition-colors" to="/">
        © {branding.site_name}
      </Link>
      <CustomMenu
        menu="auth-page-footer"
        orientation="horizontal"
        itemClassName="hover:text-fg-base transition-colors"
      />
    </div>
  );
}
