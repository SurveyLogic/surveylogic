import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {CustomPage} from '../../custom-page';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';

interface Response extends BackendResponse {
  page: CustomPage;
}

export interface CrupdatePagePayload {
  title?: string;
  body?: string;
  slug?: string;
  hide_nav?: boolean;
}

interface Props {
  payload: CrupdatePagePayload;
  pageId?: number;
}

export function useCrupdatePage(endpoint?: string) {
  const finalEndpoint = endpoint || 'custom-pages';
  return useMutation((props: Props) => crupdatePage(props, finalEndpoint), {
    onError: err => showHttpErrorToast(err),
    onSuccess: () => {
      queryClient.invalidateQueries(DatatableDataQueryKey(finalEndpoint));
    },
  });
}

function crupdatePage(
  {pageId, payload}: Props,
  endpoint: string
): Promise<Response> {
  if (pageId) {
    return apiClient.put(`${endpoint}/${pageId}`, payload).then(r => r.data);
  }
  return apiClient.post(`${endpoint}`, payload).then(r => r.data);
}
