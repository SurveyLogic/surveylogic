import React from 'react';
import {FileEntry} from '../file-entry';

export interface FilePreviewContextValue {
  entries: FileEntry[];
  activeIndex: number;
}

export const FilePreviewContext = React.createContext<FilePreviewContextValue>(
  null!
);
