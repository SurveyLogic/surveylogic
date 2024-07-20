import {BootstrapData} from './bootstrap-data';
import {createContext, useContext} from 'react';

export interface BoostrapDataContextValue<T = BootstrapData> {
  data: T;
  setBootstrapData: (data: string | T) => void;
  mergeBootstrapData: (data: Partial<T>) => void;
  invalidateBootstrapData: () => void;
}

export const BoostrapDataContext = createContext<BoostrapDataContextValue>(
  null!
);

export function useBootstrapData() {
  return useContext(BoostrapDataContext);
}
