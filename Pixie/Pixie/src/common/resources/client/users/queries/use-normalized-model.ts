import {useQuery} from '@tanstack/react-query';
import {NormalizedModel} from '../../datatable/filters/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

const buildEndpoint = (
  modelName: string,
  modelId: string | number,
  prefix = 'normalized-models'
) => `${prefix}/${modelName}/${modelId}`;

interface Response extends BackendResponse {
  model: NormalizedModel;
}

export function useNormalizedModel(
  model: string,
  modelId: string | number | null,
  queryParams?: Record<string, string>,
  userEndpoint?: string
) {
  const endpoint = buildEndpoint(model, modelId!, userEndpoint);
  return useQuery(
    [endpoint, queryParams],
    () => fetchModel(endpoint, queryParams),
    {
      enabled: model != null && modelId != null,
    }
  );
}

async function fetchModel(
  endpoint: string,
  params?: Record<string, string>
): Promise<Response> {
  return apiClient.get(endpoint, {params}).then(r => r.data);
}
