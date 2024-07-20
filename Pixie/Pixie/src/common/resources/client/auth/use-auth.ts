import {User} from './user';
import {useCallback, useContext} from 'react';
import {SiteConfigContext} from '../core/settings/site-config-context';
import {getFromLocalStorage} from '../utils/hooks/local-storage';
import {useBootstrapData} from '../core/bootstrap-data/bootstrap-data-context';
import {Permission} from '@common/auth/permission';

interface UseAuthReturn {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  getPermission: (permission: string) => Permission | undefined;
  getRestrictionValue: (
    permission: string,
    restriction: string
  ) => string | number | boolean | undefined | null;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  getRedirectUri: () => string;
}
export function useAuth(): UseAuthReturn {
  const {
    data: {user, guest_role},
  } = useBootstrapData();
  const {
    auth: {redirectUri = '/'},
  } = useContext(SiteConfigContext);

  const getPermission = useCallback(
    (name: string): Permission | undefined => {
      const permissions = user?.permissions || guest_role?.permissions;
      if (!permissions) return;
      return permissions.find(p => p.name === name);
    },
    [user?.permissions, guest_role?.permissions]
  );

  const getRestrictionValue = useCallback(
    (
      permissionName: string,
      restrictionName: string
    ): string | number | boolean | undefined | null => {
      const permission = getPermission(permissionName);
      let restrictionValue = null;
      if (permission) {
        const restriction = permission.restrictions.find(
          r => r.name === restrictionName
        );
        restrictionValue = restriction ? restriction.value : undefined;
      }
      return restrictionValue;
    },
    [getPermission]
  );

  const hasPermission = useCallback(
    (name: string): boolean => {
      const permissions = user?.permissions || guest_role?.permissions;

      const isAdmin = permissions?.find(p => p.name === 'admin') != null;
      return isAdmin || getPermission(name) != null;
    },
    [user?.permissions, guest_role?.permissions, getPermission]
  );

  const isSubscribed = user?.subscriptions?.find(sub => sub.valid) != null;

  const getRedirectUri = useCallback(() => {
    const onboarding = getFromLocalStorage('be.onboarding.selected');
    if (onboarding) {
      return `/checkout/${onboarding.productId}/${onboarding.priceId}`;
    }
    return redirectUri;
  }, [redirectUri]);

  return {
    user,
    hasPermission,
    getPermission,
    getRestrictionValue,
    isLoggedIn: !!user,
    isSubscribed,
    // where to redirect user after successful login
    getRedirectUri,
  };
}
