import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@common/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {message} from '@common/i18n/message';
import {toast} from '@common/ui/toast/toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {CustomDomain} from '@common/custom-domains/custom-domain';

interface Response extends BackendResponse {
  domain: CustomDomain;
}

interface Payload {
  host: string;
  global?: boolean;
}

export function useConnectDomain() {
  const {trans} = useTrans();
  return useMutation((props: Payload) => connectDomain(props), {
    onSuccess: response => {
      toast.positive(
        trans(
          message('“:domain” connected', {
            values: {domain: response.domain.host},
          })
        )
      );
      queryClient.invalidateQueries(DatatableDataQueryKey('custom-domain'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function connectDomain(payload: Payload): Promise<Response> {
  return apiClient.post('custom-domain', payload).then(r => r.data);
}
