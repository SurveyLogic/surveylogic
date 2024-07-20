import {Link} from 'react-router-dom';
import {ReactNode} from 'react';
import {AuthLayoutFooter} from './auth-layout-footer';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import authBgSvg from './auth-bg.svg';
import {useTrans} from '@common/i18n/use-trans';
import {useSettings} from '@common/core/settings/use-settings';

interface AuthPageProps {
  heading?: ReactNode;
  message?: ReactNode;
  children: ReactNode;
}
export function AuthLayout({heading, children, message}: AuthPageProps) {
  const {branding} = useSettings();
  const isDarkMode = useIsDarkMode();
  const {trans} = useTrans();

  return (
    <main
      className="w-full h-full flex flex-col items-center bg-alt dark:bg-none pt-70 px-14 md:px-10vw overflow-y-auto"
      style={{backgroundImage: isDarkMode ? undefined : `url("${authBgSvg}")`}}
    >
      <Link
        to="/"
        className="block flex-shrink-0 mb-40"
        aria-label={trans({message: 'Go to homepage'})}
      >
        <img
          src={isDarkMode ? branding.logo_light : branding?.logo_dark}
          className="block h-42 w-auto m-auto"
          alt=""
        />
      </Link>
      <div className="rounded-lg max-w-440 px-40 pt-40 pb-32 w-full mx-auto bg-paper shadow md:shadow-xl">
        {heading && <h1 className="mb-20 text-xl">{heading}</h1>}
        {children}
      </div>
      {message && <div className="mt-36 text-sm">{message}</div>}
      <AuthLayoutFooter />
    </main>
  );
}
