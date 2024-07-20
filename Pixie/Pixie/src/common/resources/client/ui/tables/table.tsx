import React, {
  cloneElement,
  ComponentPropsWithoutRef,
  Fragment,
  JSXElementConstructor,
  MutableRefObject,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {useControlledState} from '@react-stately/utils';
import {SortDescriptor} from './types/sort-descriptor';
import {useGridNavigation} from './navigate-grid';
import {RowElementProps, TableRow} from './table-row';
import {
  TableContext,
  TableContextValue,
  TableSelectionStyle,
} from './table-context';
import {ColumnConfig} from '../../datatable/column-config';
import {TableDataItem} from './types/table-data-item';
import clsx from 'clsx';
import {useInteractOutside} from '@react-aria/interactions';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {isCtrlKeyPressed} from '@common/utils/keybinds/is-ctrl-key-pressed';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {CheckboxColumnConfig} from '@common/ui/tables/checkbox-column-config';
import {TableHeaderRow} from '@common/ui/tables/table-header-row';

export interface TableProps<T extends TableDataItem>
  extends ComponentPropsWithoutRef<'table'> {
  className?: string;
  columns: ColumnConfig<T>[];
  hideHeaderRow?: boolean;
  data: T[];
  meta?: any;
  tableRef?: MutableRefObject<HTMLTableElement>;
  selectedRows?: (number | string)[];
  defaultSelectedRows?: (number | string)[];
  onSelectionChange?: (keys: (number | string)[]) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => any;
  enableSorting?: boolean;
  onDelete?: (items: T[]) => void;
  enableSelection?: boolean;
  selectionStyle?: TableSelectionStyle;
  ariaLabelledBy?: string;
  onAction?: (item: T, index: number) => void;
  selectRowOnContextMenu?: boolean;
  renderRowAs?: JSXElementConstructor<RowElementProps<T>>;
  tableBody?: ReactElement<TableBodyProps>;
  hideBorder?: boolean;
  closeOnInteractOutside?: boolean;
  collapseOnMobile?: boolean;
}
export function Table<T extends TableDataItem>({
  className,
  columns: userColumns,
  collapseOnMobile = true,
  hideHeaderRow = false,
  hideBorder = false,
  data,
  selectedRows: propsSelectedRows,
  defaultSelectedRows: propsDefaultSelectedRows,
  onSelectionChange: propsOnSelectionChange,
  sortDescriptor: propsSortDescriptor,
  onSortChange: propsOnSortChange,
  enableSorting = true,
  onDelete,
  enableSelection = true,
  selectionStyle = 'checkbox',
  ariaLabelledBy,
  selectRowOnContextMenu,
  onAction,
  renderRowAs,
  tableBody,
  meta,
  tableRef: propsTableRef,
  closeOnInteractOutside = false,
  ...domProps
}: TableProps<T>) {
  const isMobile = useIsMobileMediaQuery();
  const isCollapsedMode = !!isMobile && collapseOnMobile;
  if (isCollapsedMode) {
    hideHeaderRow = true;
    hideBorder = true;
  }

  const [selectedRows, onSelectionChange] = useControlledState(
    propsSelectedRows,
    propsDefaultSelectedRows || [],
    propsOnSelectionChange
  );

  const [sortDescriptor, onSortChange] = useControlledState(
    propsSortDescriptor,
    undefined,
    propsOnSortChange
  );

  const toggleRow = useCallback(
    (item: TableDataItem) => {
      const newValues = [...selectedRows];
      if (!newValues.includes(item.id)) {
        newValues.push(item.id);
      } else {
        const index = newValues.indexOf(item.id);
        newValues.splice(index, 1);
      }
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );

  const selectRow = useCallback(
    // allow deselecting all rows by passing in null
    (item: TableDataItem | null, merge?: boolean) => {
      let newValues: (string | number)[] = [];
      if (item) {
        newValues = merge
          ? [...selectedRows?.filter(id => id !== item.id), item.id]
          : [item.id];
      }
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );

  // add checkbox columns to config, if selection is enabled
  const columns = useMemo(() => {
    const filteredColumns = userColumns.filter(c => {
      const visibleInMode = c.visibleInMode || 'regular';
      if (visibleInMode === 'all') {
        return true;
      }
      if (visibleInMode === 'compact' && isCollapsedMode) {
        return true;
      }
      if (visibleInMode === 'regular' && !isCollapsedMode) {
        return true;
      }
    });
    const showCheckboxCell =
      enableSelection && selectionStyle !== 'highlight' && !isMobile;
    if (showCheckboxCell) {
      filteredColumns.unshift(CheckboxColumnConfig);
    }
    return filteredColumns;
  }, [isMobile, userColumns, enableSelection, selectionStyle, isCollapsedMode]);

  const contextValue: TableContextValue<T> = {
    isCollapsedMode,
    hideBorder,
    hideHeaderRow,
    selectedRows,
    onSelectionChange,
    enableSorting,
    enableSelection,
    selectionStyle,
    data,
    columns,
    sortDescriptor,
    onSortChange,
    toggleRow,
    selectRow,
    onAction,
    selectRowOnContextMenu,
    meta,
    collapseOnMobile,
  };

  const navProps = useGridNavigation({
    cellCount: enableSelection ? columns.length + 1 : columns.length,
    rowCount: data.length + 1,
  });

  const tableBodyProps: TableBodyProps = {
    renderRowAs: renderRowAs as any,
  };

  if (!tableBody) {
    tableBody = <BasicTableBody {...tableBodyProps} />;
  } else {
    tableBody = cloneElement(tableBody, tableBodyProps);
  }

  // deselect rows when clicking outside the table
  const tableRef = useObjectRef(propsTableRef);
  useInteractOutside({
    ref: tableRef,
    onInteractOutside: e => {
      if (
        closeOnInteractOutside &&
        enableSelection &&
        selectedRows?.length &&
        // don't deselect if clicking on a dialog (for example is table row has a context menu)
        !(e.target as HTMLElement).closest('[role="dialog"]')
      ) {
        onSelectionChange([]);
      }
    },
  });

  return (
    <TableContext.Provider value={contextValue as any}>
      <div
        {...mergeProps(domProps, navProps, {
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              if (selectedRows?.length) {
                onSelectionChange([]);
              }
            } else if (e.key === 'Delete') {
              e.preventDefault();
              e.stopPropagation();
              if (selectedRows?.length) {
                onDelete?.(
                  data.filter(item => selectedRows?.includes(item.id))
                );
              }
            } else if (isCtrlKeyPressed(e) && e.key === 'a') {
              e.preventDefault();
              e.stopPropagation();
              if (enableSelection) {
                onSelectionChange(data.map(item => item.id));
              }
            }
          },
        })}
        role="grid"
        tabIndex={0}
        aria-rowcount={data.length + 1}
        aria-colcount={columns.length + 1}
        ref={tableRef}
        aria-multiselectable={enableSelection ? true : undefined}
        aria-labelledby={ariaLabelledBy}
        className={clsx(
          className,
          'select-none isolate outline-none text-sm focus-visible:ring-2'
        )}
      >
        {!hideHeaderRow && <TableHeaderRow />}
        {tableBody}
      </div>
    </TableContext.Provider>
  );
}

export interface TableBodyProps {
  renderRowAs?: TableProps<TableDataItem>['renderRowAs'];
}
function BasicTableBody({renderRowAs}: TableBodyProps) {
  const {data} = useContext(TableContext);
  return (
    <Fragment>
      {data.map((item, rowIndex) => (
        <TableRow
          item={item}
          index={rowIndex}
          key={item.id}
          renderAs={renderRowAs}
        />
      ))}
    </Fragment>
  );
}
