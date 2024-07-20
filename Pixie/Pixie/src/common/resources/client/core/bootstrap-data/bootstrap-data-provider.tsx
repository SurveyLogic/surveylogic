import React, {useMemo} from 'react';
import {
  invalidateBootstrapData,
  mergeBootstrapData,
  setBootstrapData,
  useBackendBootstrapData,
} from './use-backend-bootstrap-data';
import {
  BoostrapDataContext,
  BoostrapDataContextValue,
} from './bootstrap-data-context';

interface BootstrapDataProviderProps {
  children: any;
}
export function BootstrapDataProvider({children}: BootstrapDataProviderProps) {
  const data = useBackendBootstrapData();

  const value: BoostrapDataContextValue = useMemo(() => {
    return {
      data,
      setBootstrapData: setBootstrapData,
      mergeBootstrapData: mergeBootstrapData,
      invalidateBootstrapData: invalidateBootstrapData,
    };
  }, [data]);

  return (
    <BoostrapDataContext.Provider value={value}>
      {children}
    </BoostrapDataContext.Provider>
  );
}
