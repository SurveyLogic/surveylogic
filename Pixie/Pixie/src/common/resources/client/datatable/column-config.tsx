import React, {ReactElement, ReactNode} from 'react';
import {TableDataItem} from '../ui/tables/types/table-data-item';

export interface RowContext {
  isHovered: boolean;
  index: number;
  isPlaceholder?: boolean;
}

export interface ColumnConfig<T extends TableDataItem> {
  key: string;
  header: () => ReactElement;
  hideHeader?: boolean;
  align?: 'start' | 'center' | 'end';
  padding?: string;
  className?: string;
  body: (item: T, rowContext: RowContext) => ReactNode;
  allowsSorting?: boolean;
  sortingKey?: string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  visibleInMode?: 'compact' | 'regular' | 'all';
}
