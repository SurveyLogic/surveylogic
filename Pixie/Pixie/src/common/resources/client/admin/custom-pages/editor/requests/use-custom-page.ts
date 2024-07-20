import {useQuery} from '@tanstack/react-query';
import {useParams} from 'react-router-dom';
import {CustomPage} from '../../custom-page';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {apiClient} from '../../../../http/query-client';

export interface FetchUseCustomPageResponse extends BackendResponse {
  page: CustomPage;
}

function fetchCustomPage(
  pageId: number | string
): Promise<FetchUseCustomPageResponse> {
  return apiClient
    .get(`custom-pages/${pageId}`)
    .then(response => response.data);
}

export function useCustomPage() {
  const {pageId} = useParams();
  return useQuery(['custom-pages', pageId], () => fetchCustomPage(pageId!), {
    enabled: !!pageId,
  });
}
