import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  //
}

interface Payload {
  commentIds: number[];
}

export function useDeleteComments() {
  return useMutation((payload: Payload) => deleteComments(payload), {
    onSuccess: (response, payload) => {
      toast(
        message('Deleted [one 1 comment|other :count comments]', {
          values: {count: payload.commentIds.length},
        })
      );
    },
    onError: err => showHttpErrorToast(err),
  });
}

function deleteComments({commentIds}: Payload): Promise<Response> {
  return apiClient.delete(`comment/${commentIds.join(',')}`).then(r => r.data);
}
