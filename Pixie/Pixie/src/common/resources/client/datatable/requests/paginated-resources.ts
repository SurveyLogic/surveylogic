import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {PaginatedBackendResponse} from '../../http/backend-response/pagination-response';
import {apiClient} from '../../http/query-client';

export interface GetDatatableDataParams {
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  filters?: string | null;
  query?: string;
  with?: string;
  perPage?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export const DatatableDataQueryKey = (
  endpoint: string,
  params?: GetDatatableDataParams | Record<string, string | number | boolean>
) => {
  // split endpoint by slash, so we can clear cache from the root later,
  // for example, 'link-group' will clear 'link-group/1/links' endpoint
  const key: (string | GetDatatableDataParams)[] = endpoint.split('/');
  if (params) {
    key.push(params);
  }
  return key;
};

export function useDatatableData<T = object>(
  endpoint: string,
  params: GetDatatableDataParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedBackendResponse<T>,
      unknown,
      PaginatedBackendResponse<T>,
      any[]
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery(
    DatatableDataQueryKey(endpoint, params),
    () => paginate<T>(endpoint, params),
    {
      ...options,
      keepPreviousData: true,
    }
  );
}

function paginate<T>(
  endpoint: string,
  params: GetDatatableDataParams
): Promise<PaginatedBackendResponse<T>> {
  return apiClient.get(endpoint, {params}).then(response => response.data);
}
