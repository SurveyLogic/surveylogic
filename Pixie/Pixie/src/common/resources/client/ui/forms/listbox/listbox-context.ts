import {createContext, useContext} from 'react';
import {UseListboxReturn} from './types';

type ListBoxReturnType = UseListboxReturn;
export type ListboxContextValue = ListBoxReturnType;

export const ListBoxContext = createContext<ListboxContextValue>(null!);

export function useListboxContext() {
  return useContext(ListBoxContext);
}
