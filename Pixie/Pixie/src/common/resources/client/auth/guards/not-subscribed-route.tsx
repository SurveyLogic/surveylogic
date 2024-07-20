import {useAuth} from '../use-auth';
import {ReactElement} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

interface GuestRouteProps {
  children: ReactElement;
}
export function NotSubscribedRoute({children}: GuestRouteProps) {
  const {isLoggedIn, isSubscribed} = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/register" replace />;
  }

  if (isLoggedIn && isSubscribed) {
    return <Navigate to="/billing" replace />;
  }

  return children || <Outlet />;
}
