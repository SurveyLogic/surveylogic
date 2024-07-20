import {StoreApi, useStore} from 'zustand';
import {createContext, ReactNode, useContext, useState} from 'react';
import {createFileUploadStore, FileUploadState} from './file-upload-store';
import {useSettings} from '../../core/settings/use-settings';

const FileUploadContext = createContext<StoreApi<FileUploadState>>(null!);

type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type UseFileUploadStore = {
  (): ExtractState<StoreApi<FileUploadState>>;
  <U>(
    selector: (state: ExtractState<StoreApi<FileUploadState>>) => U,
    equalityFn?: (a: U, b: U) => boolean
  ): U;
};

// @ts-ignore
export const useFileUploadStore: UseFileUploadStore = (
  selector,
  equalityFn
) => {
  const store = useContext(FileUploadContext);
  return useStore(store, selector, equalityFn);
};

interface FileUploadProviderProps {
  children: ReactNode;
}
export function FileUploadProvider({children}: FileUploadProviderProps) {
  const settings = useSettings();

  //lazily create store object only once
  const [store] = useState(() => {
    return createFileUploadStore({settings});
  });

  return (
    <FileUploadContext.Provider value={store as StoreApi<FileUploadState>}>
      {children}
    </FileUploadContext.Provider>
  );
}
