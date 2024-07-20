import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {message} from '../../i18n/message';
import {apiClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

function GenerateSitemap(): Promise<Response> {
  return apiClient.post('sitemap/generate').then(r => r.data);
}

export function useGenerateSitemap() {
  return useMutation(() => GenerateSitemap(), {
    onSuccess: () => {
      toast(message('Sitemap generated'));
    },
    onError: err => showHttpErrorToast(err),
  });
}
