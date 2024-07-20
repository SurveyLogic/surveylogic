import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {toast} from '../../../../ui/toast/toast';
import {message} from '../../../../i18n/message';
import {apiClient} from '../../../../http/query-client';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Props {
  id: number;
}

function deleteAccessToken({id}: Props): Promise<Response> {
  return apiClient.delete(`access-tokens/${id}`).then(r => r.data);
}

export function useDeleteAccessToken() {
  return useMutation((props: Props) => deleteAccessToken(props), {
    onSuccess: () => {
      toast(message('Token deleted'));
    },
    onError: err => showHttpErrorToast(err),
  });
}
