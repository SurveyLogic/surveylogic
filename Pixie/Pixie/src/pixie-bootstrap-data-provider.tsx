import React, {useMemo} from 'react';
import {
  BoostrapDataContext,
  BoostrapDataContextValue,
} from '@common/core/bootstrap-data/bootstrap-data-context';
import {useStore} from './state/store';

interface BootstrapDataProviderProps {
  children: any;
}
export function PixieBootstrapDataProvider({
  children,
}: BootstrapDataProviderProps) {
  const data = useStore(s => s.bootstrapData);

  const value: BoostrapDataContextValue = useMemo(() => {
    return {
      data,
      setBootstrapData: () => {},
      mergeBootstrapData: () => {},
      invalidateBootstrapData: () => {},
    };
  }, [data]) as BoostrapDataContextValue;

  return (
    <BoostrapDataContext.Provider value={value}>
      {children}
    </BoostrapDataContext.Provider>
  );
}
