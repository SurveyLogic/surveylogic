import {
  createPath,
  NavigateFunction,
  resolvePath,
  useLocation,
  useNavigate as useRouterNavigate
} from 'react-router-dom';
import {useCallback} from 'react';

export function useNavigate() {
  const routerNavigate = useRouterNavigate();
  const location = useLocation();

  return useCallback(
    (to, options) => {
      // prevent duplicates in history when navigating to the same url
      const replace =
        createPath(location) === createPath(resolvePath(to, location.pathname));

      routerNavigate(to, {
        ...options,
        replace: options?.replace !== false && replace,
      });
    },
    [routerNavigate, location]
  ) as NavigateFunction;
}
