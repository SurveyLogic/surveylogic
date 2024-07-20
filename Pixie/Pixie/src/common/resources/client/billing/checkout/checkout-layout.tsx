import {ReactElement, useEffect} from 'react';
import {Navbar} from '../../ui/navigation/navbar/navbar';
import {CustomMenu} from '../../menus/custom-menu';
import {LocaleSwitcher} from '../../i18n/locale-switcher';
import {removeFromLocalStorage} from '../../utils/hooks/local-storage';
import {StaticPageTitle} from '../../seo/static-page-title';
import {Trans} from '../../i18n/trans';

interface CheckoutLayoutProps {
  children: [ReactElement, ReactElement];
}
export function CheckoutLayout({children}: CheckoutLayoutProps) {
  const [left, right] = children;

  useEffect(() => {
    removeFromLocalStorage('be.onboarding.selected');
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StaticPageTitle>
        <Trans message="Checkout" />
      </StaticPageTitle>
      <Navbar
        size="sm"
        color="transparent"
        className="flex-shrink-0 z-10 mb-20 md:mb-0"
        textColor="text-main"
        logoColor="dark"
        darkModeColor="transparent"
        menuPosition="checkout-page-navbar"
      />
      <div className="flex-auto md:flex w-full mx-auto justify-between px-20 md:px-0 md:pt-128 md:max-w-950">
        <div className="hidden md:block fixed right-0 top-0 w-1/2 h-full bg-alt shadow-[15px_0_30px_0_rgb(0_0_0_/_18%)]" />
        <div className="md:w-400 overflow-hidden">
          {left}
          <CustomMenu
            menu="checkout-page-footer"
            className="text-xs mt-50 text-muted overflow-x-auto"
          />
          <div className="mt-40">
            <LocaleSwitcher />
          </div>
        </div>
        <div className="hidden md:block w-384">
          <div className="relative z-10">{right}</div>
        </div>
      </div>
    </div>
  );
}
