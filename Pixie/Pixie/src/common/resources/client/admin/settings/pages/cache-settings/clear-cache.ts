import {useMutation} from '@tanstack/react-query';
import {toast} from '../../../../ui/toast/toast';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {message} from '../../../../i18n/message';
import {apiClient} from '../../../../http/query-client';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

function clearCache(): Promise<Response> {
  return apiClient.post('cache/flush').then(r => r.data);
}

export function useClearCache() {
  return useMutation(() => clearCache(), {
    onSuccess: () => {
      toast(message('Cache cleared'));
    },
    onError: err => showHttpErrorToast(err),
  });
}
