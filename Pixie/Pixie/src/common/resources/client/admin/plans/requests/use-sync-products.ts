import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../../http/query-client';
import {useTrans} from '../../../i18n/use-trans';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useSyncProducts() {
  const {trans} = useTrans();
  return useMutation(() => syncPlans(), {
    onSuccess: () => {
      toast(trans(message('Plans synced')));
    },
    onError: err => showHttpErrorToast(err, message('Could not sync plans')),
  });
}

function syncPlans(): Promise<Response> {
  return apiClient.post('billing/products/sync').then(r => r.data);
}
