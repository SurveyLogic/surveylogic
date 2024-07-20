import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../http/query-client';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {useTrans} from '../../../i18n/use-trans';
import {message} from '../../../i18n/message';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

const endpoint = (id: number) => `billing/products/${id}`;

interface Response extends BackendResponse {}

interface Payload {
  productId: number;
}

export function useDeleteProduct() {
  const {trans} = useTrans();
  return useMutation((payload: Payload) => updateProduct(payload), {
    onSuccess: () => {
      toast(trans(message('Plan deleted')));
      queryClient.invalidateQueries(DatatableDataQueryKey('billing/products'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateProduct({productId}: Payload): Promise<Response> {
  return apiClient.delete(endpoint(productId)).then(r => r.data);
}
