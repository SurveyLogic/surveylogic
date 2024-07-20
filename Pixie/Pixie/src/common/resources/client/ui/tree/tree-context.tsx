import {createContext, Key} from 'react';

export interface TreeContextValue {
  expandedKeys: Key[];
  setExpandedKeys: (value: Key[]) => void;
  selectedKeys: Key[];
  setSelectedKeys: (value: Key[]) => void;
  focusedNode?: Key;
  setFocusedNode: (node?: Key) => void;
}

export const TreeContext = createContext<TreeContextValue>(null!);
