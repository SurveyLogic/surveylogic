import React, {
  cloneElement,
  ComponentProps,
  Key,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import {TableDataItem} from '../ui/tables/types/table-data-item';
import {BackendFilter} from './filters/backend-filter';
import {MessageDescriptor} from '../i18n/message-descriptor';
import {ColumnConfig} from './column-config';
import {useTrans} from '../i18n/use-trans';
import {useBackendFilterUrlParams} from './filters/backend-filter-url-params';
import {
  GetDatatableDataParams,
  useDatatableData,
} from './requests/paginated-resources';
import {DataTableContext} from './page/data-table-context';
import {AnimatePresence} from 'framer-motion';
import {ProgressBar} from '../ui/progress/progress-bar';
import {Table, TableProps} from '../ui/tables/table';
import {DataTablePaginationFooter} from './data-table-pagination-footer';
import {DataTableHeader} from './data-table-header';
import {FilterList} from './filters/filter-list/filter-list';
import {SelectedStateDatatableHeader} from '@common/datatable/selected-state-datatable-header';
import clsx from 'clsx';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';

export interface DataTableProps<T extends TableDataItem> {
  filters?: BackendFilter[];
  columns: ColumnConfig<T>[];
  searchPlaceholder?: MessageDescriptor;
  queryParams?: Record<string, string | number | undefined | null>;
  endpoint: string;
  resourceName?: ReactNode;
  emptyStateMessage: ReactElement<{isFiltering: boolean}>;
  actions?: ReactNode;
  enableSelection?: boolean;
  selectedActions?: ReactNode;
  onRowAction?: TableProps<T>['onAction'];
  tableDomProps?: ComponentProps<'table'>;
  children?: ReactNode;
  collapseTableOnMobile?: boolean;
}
export function DataTable<T extends TableDataItem>({
  filters,
  columns,
  searchPlaceholder,
  queryParams,
  endpoint,
  actions,
  selectedActions,
  emptyStateMessage,
  tableDomProps,
  onRowAction,
  enableSelection = true,
  children,
  collapseTableOnMobile = true,
}: DataTableProps<T>) {
  const isMobile = useIsMobileMediaQuery();
  const {trans} = useTrans();
  const {encodedFilters} = useBackendFilterUrlParams(filters);
  const [params, setParams] = useState<GetDatatableDataParams>({perPage: 15});
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const query = useDatatableData<T>(
    endpoint,
    {
      ...params,
      ...queryParams,
      filters: encodedFilters,
    },
    {
      onSuccess: () => {
        // clear selected rows when table is reloaded from backend to avoid stale ids
        setSelectedRows([]);
      },
    }
  );

  const isFiltering = !!(params.query || params.filters || encodedFilters);
  const pagination = query.data?.pagination;

  return (
    <DataTableContext.Provider
      value={{
        selectedRows,
        setSelectedRows,
        endpoint,
        params,
        setParams,
        query,
      }}
    >
      {children}
      <AnimatePresence initial={false} mode="wait">
        {selectedRows.length ? (
          <SelectedStateDatatableHeader
            selectedItemsCount={selectedRows.length}
            actions={selectedActions}
            key="selected"
          />
        ) : (
          <DataTableHeader
            searchPlaceholder={searchPlaceholder}
            searchValue={params.query}
            onSearchChange={query => setParams({...params, query})}
            actions={actions}
            filters={filters}
            key="default"
          />
        )}
      </AnimatePresence>
      {filters && <FilterList className="mb-14" filters={filters} />}
      <div
        className={clsx(
          'relative rounded',
          (!isMobile || !collapseTableOnMobile) && 'border'
        )}
      >
        {query.isLoading && (
          <ProgressBar
            isIndeterminate
            className="absolute top-0 left-0 w-full z-10"
            aria-label={trans({message: 'Loading'})}
            size="xs"
          />
        )}

        <div className="relative overflow-x-auto md:overflow-hidden">
          <Table
            {...tableDomProps}
            columns={columns}
            data={pagination?.data || []}
            sortDescriptor={params}
            onSortChange={descriptor => {
              setParams({...params, ...descriptor});
            }}
            selectedRows={selectedRows}
            enableSelection={enableSelection}
            onSelectionChange={setSelectedRows}
            onAction={onRowAction}
            collapseOnMobile={collapseTableOnMobile}
          />
        </div>

        {(query.isFetched || query.isPreviousData) &&
        !pagination?.data.length ? (
          <div className="pt-50">
            {cloneElement(emptyStateMessage, {
              isFiltering,
            })}
          </div>
        ) : undefined}

        <DataTablePaginationFooter
          query={query}
          onPageChange={page => setParams({...params, page})}
          onPerPageChange={perPage => setParams({...params, perPage})}
        />
      </div>
    </DataTableContext.Provider>
  );
}
