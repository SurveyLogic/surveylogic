import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {NormalizedModel} from '../../datatable/filters/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

const defaultEndpoint = (model: string, prefix: string = 'normalized-models') =>
  `${prefix}/${model}`;

interface Response extends BackendResponse {
  results: NormalizedModel[];
}

interface Params {
  query?: string;
  perPage?: number;
}

export function useNormalizedModels(
  model: string,
  queryParams: Params,
  queryOptions?: Omit<
    UseQueryOptions<Response, unknown, Response, [string, Params]>,
    'queryKey' | 'queryFn'
  > | null,
  userEndpoint?: string
) {
  const endpoint = defaultEndpoint(model, userEndpoint);
  return useQuery(
    [endpoint, queryParams],
    () => fetchUsers(endpoint, queryParams),
    {
      keepPreviousData: true,
      ...queryOptions,
    }
  );
}

async function fetchUsers(endpoint: string, params: Params) {
  return apiClient.get<Response>(endpoint, {params}).then(r => r.data);
}
