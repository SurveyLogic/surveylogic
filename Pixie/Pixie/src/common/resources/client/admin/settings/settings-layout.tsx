import clsx from 'clsx';
import {NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {SettingsNavConfig} from './settings-nav-config';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';
import {Option, Select} from '../../ui/forms/select/select';
import {Trans} from '../../i18n/trans';
import {StaticPageTitle} from '../../seo/static-page-title';

interface Props {
  className?: string;
}
export function SettingsLayout({className}: Props) {
  const isMobile = useIsMobileMediaQuery();
  return (
    <div
      className={clsx(
        className,
        'md:flex gap-30 min-h-full items-start p-24 container mx-auto'
      )}
    >
      <StaticPageTitle>
        <Trans message="Settings" />
      </StaticPageTitle>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <div className="md:px-30 flex-auto relative max-w-500">
        <Outlet />
      </div>
    </div>
  );
}

function MobileNav() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const value = pathname.split('/').pop();

  return (
    <Select
      minWidth="min-w-none"
      className="w-full bg-paper mb-24"
      selectionMode="single"
      selectedValue={value}
      onSelectionChange={newPage => {
        navigate(newPage as string);
      }}
    >
      {SettingsNavConfig.map(item => (
        <Option key={item.to as string} value={item.to}>
          <Trans {...item.label} />
        </Option>
      ))}
    </Select>
  );
}

function DesktopNav() {
  return (
    <div className="w-240 sticky top-24 flex-shrink-0">
      {SettingsNavConfig.map(item => (
        <NavLink
          key={item.to as string}
          to={item.to}
          className={({isActive}) =>
            clsx(
              'block p-14 whitespace-nowrap mb-8 rounded border-l-4 text-sm transition-bg-color',
              isActive
                ? 'bg-primary/selected border-l-primary font-medium'
                : 'border-l-transparent hover:bg-hover'
            )
          }
        >
          <Trans {...item.label} />
        </NavLink>
      ))}
    </div>
  );
}
