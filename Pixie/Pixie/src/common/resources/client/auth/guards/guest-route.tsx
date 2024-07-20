import {useAuth} from '../use-auth';
import {ReactElement} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAppearanceEditorMode} from '../../admin/appearance/commands/use-appearance-editor-mode';

interface GuestRouteProps {
  children: ReactElement;
}
export function GuestRoute({children}: GuestRouteProps) {
  const {isLoggedIn, getRedirectUri} = useAuth();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const redirectUri = getRedirectUri();
  const {pathname} = useLocation();

  if (isLoggedIn && !isAppearanceEditorActive) {
    // prevent recursive redirects
    if (redirectUri !== pathname) {
      return <Navigate to={redirectUri} replace />;
    }
  }

  return children || <Outlet />;
}
