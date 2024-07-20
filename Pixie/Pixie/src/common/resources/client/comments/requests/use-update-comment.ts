import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  //
}

interface Payload {
  commentId: number;
  content: string;
}

export function useUpdateComment() {
  return useMutation((props: Payload) => updateComment(props), {
    onSuccess: () => {
      toast(message('Comment updated'));
      queryClient.invalidateQueries(['comment']);
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateComment({commentId, content}: Payload): Promise<Response> {
  return apiClient.put(`comment/${commentId}`, {content}).then(r => r.data);
}
