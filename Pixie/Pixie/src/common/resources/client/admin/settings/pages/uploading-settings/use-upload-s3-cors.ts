import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../../http/query-client';
import {useTrans} from '../../../../i18n/use-trans';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';
import {message} from '../../../../i18n/message';
import {toast} from '../../../../ui/toast/toast';

interface Response extends BackendResponse {}

export function useUploadS3Cors() {
  const {trans} = useTrans();
  return useMutation(() => uploadCors(), {
    onSuccess: () => {
      toast(trans(message('CORS file updated')));
      queryClient.invalidateQueries(['Query Key']);
    },
    onError: err => showHttpErrorToast(err),
  });
}

function uploadCors(): Promise<Response> {
  return apiClient.post('s3/cors/upload').then(r => r.data);
}
