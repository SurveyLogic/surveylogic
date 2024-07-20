import {useAuth} from '../use-auth';
import {ReactElement} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

interface GuestRouteProps {
  children: ReactElement;
}
export function SubscribedRoute({children}: GuestRouteProps) {
  const {isSubscribed} = useAuth();

  if (!isSubscribed) {
    return <Navigate to="/pricing" replace />;
  }

  return children || <Outlet />;
}
