import {useInfiniteQuery, UseInfiniteQueryResult} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {
  hasNextPage,
  PaginationResponse,
} from '@common/http/backend-response/pagination-response';
import {useMemo, useState} from 'react';
import {SortDescriptor} from '@common/ui/tables/types/sort-descriptor';
import {GetDatatableDataParams} from '@common/datatable/requests/paginated-resources';
import {QueryKey} from '@tanstack/query-core/src/types';

export type UseInfiniteDataResult<T> = UseInfiniteQueryResult<
  PaginationResponse<T>
> & {
  items: T[];
  totalItems: number | null;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

function buildQueryKey(
  {
    queryKey,
    defaultOrderDir,
    defaultOrderBy,
    queryParams,
  }: UseInfiniteDataProps<any>,
  sortDescriptor: SortDescriptor,
  searchQuery: string = ''
) {
  // make sure to always set default order dir and col so query keys are consistent
  if (!sortDescriptor.orderBy) {
    sortDescriptor.orderBy = defaultOrderBy;
  }
  if (!sortDescriptor.orderDir) {
    sortDescriptor.orderDir = defaultOrderDir;
  }
  return [...queryKey, sortDescriptor, searchQuery, queryParams];
}

interface Response<T> extends BackendResponse {
  pagination: PaginationResponse<T>;
}

export interface UseInfiniteDataProps<T> {
  initialPage?: PaginationResponse<T> | null;
  queryKey: QueryKey;
  queryParams?: Record<string, string | number>;
  endpoint: string;
  defaultOrderBy?: SortDescriptor['orderBy'];
  defaultOrderDir?: SortDescriptor['orderDir'];
  // whether user can sort items manually (table header, dropdown, etc)
  willSortOrFilter?: boolean;
  // ordering is not available with cursor pagination
  paginate?: 'simple' | 'lengthAware' | 'cursor';
  transformResponse?: (response: Response<T>) => Response<T>;
}
export function useInfiniteData<T>(
  props: UseInfiniteDataProps<T>
): UseInfiniteDataResult<T> {
  const {
    initialPage,
    endpoint,
    defaultOrderBy,
    defaultOrderDir,
    queryParams,
    paginate,
    transformResponse,
    willSortOrFilter = false,
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    orderBy: defaultOrderBy,
    orderDir: defaultOrderDir,
  });

  const query = useInfiniteQuery({
    keepPreviousData: willSortOrFilter,
    queryKey: buildQueryKey(props, sortDescriptor, searchQuery),
    queryFn: ({pageParam}) => {
      const params: GetDatatableDataParams = {
        ...queryParams,
        perPage: initialPage?.per_page,
        query: searchQuery,
        paginate,
        ...sortDescriptor,
      };
      if (paginate === 'cursor') {
        params.cursor = pageParam;
      } else {
        params.page = pageParam || 1;
      }
      return fetchData<T>(endpoint, params, transformResponse);
    },
    getNextPageParam: lastResponse => {
      if (!hasNextPage(lastResponse.pagination)) {
        return undefined;
      }
      if ('next_cursor' in lastResponse.pagination) {
        return lastResponse.pagination.next_cursor;
      }
      return lastResponse.pagination.current_page + 1;
    },
    initialData: () => {
      if (
        !initialPage ||
        // if sorting or search changed, remove initial data, so query is reset
        sortDescriptor.orderBy !== defaultOrderBy ||
        sortDescriptor.orderDir !== defaultOrderDir ||
        !!searchQuery
      ) {
        return undefined;
      }

      return {
        pageParams: [undefined, 1],
        pages: [{pagination: initialPage}],
      };
    },
  });

  const items = useMemo(() => {
    return query.data?.pages.flatMap(p => p.pagination.data) || [];
  }, [query.data?.pages]);

  const firstPage = query.data?.pages[0].pagination;
  const totalItems =
    firstPage && 'total' in firstPage && firstPage.total
      ? firstPage.total
      : null;

  return {
    ...query,
    items,
    totalItems,
    sortDescriptor,
    setSortDescriptor,
    searchQuery,
    setSearchQuery,
  } as UseInfiniteDataResult<T>;
}

function fetchData<T>(
  endpoint: string,
  params: GetDatatableDataParams,
  transformResponse?: UseInfiniteDataProps<T>['transformResponse']
): Promise<Response<T>> {
  return apiClient.get(endpoint, {params}).then(r => {
    if (transformResponse) {
      return transformResponse(r.data);
    }
    return r.data;
  });
}
