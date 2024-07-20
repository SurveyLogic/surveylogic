import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../http/query-client';
import {BackendResponse} from '../http/backend-response/backend-response';
import {CustomPage} from '../admin/custom-pages/custom-page';

const endpoint = (slugOrId: number | string) => `custom-pages/${slugOrId}`;

export interface FetchCustomPageResponse extends BackendResponse {
  page: CustomPage;
}

export function useCustomPage(pageId: number | string) {
  return useQuery([endpoint(pageId)], () => fetchCustomPage(pageId));
}

function fetchCustomPage(
  slugOrId: number | string
): Promise<FetchCustomPageResponse> {
  return apiClient.get(endpoint(slugOrId)).then(response => response.data);
}
