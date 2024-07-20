import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {message} from '@common/i18n/message';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useUnbanUser(userId: number) {
  return useMutation(() => unbanUser(userId), {
    onSuccess: () => {
      toast(message('User unsuspended'));
      queryClient.invalidateQueries(['users']);
    },
    onError: r => showHttpErrorToast(r),
  });
}

function unbanUser(userId: number): Promise<Response> {
  return apiClient.delete(`users/${userId}/unban`).then(r => r.data);
}
