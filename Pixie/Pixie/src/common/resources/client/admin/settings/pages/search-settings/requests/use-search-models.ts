import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {useQuery} from '@tanstack/react-query';

interface Response extends BackendResponse {
  models: {model: string; name: string}[];
}

export function useSearchModels() {
  return useQuery(['search-models'], () => fetchModels());
}

function fetchModels(): Promise<Response> {
  return apiClient.get('admin/search/models').then(response => response.data);
}
