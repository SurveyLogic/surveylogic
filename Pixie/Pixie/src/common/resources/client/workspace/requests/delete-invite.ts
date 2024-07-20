import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {useUserNotifications} from '../../notifications/dialog/requests/user-notifications';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Props {
  inviteId: string;
}

function deleteInvite({inviteId}: Props): Promise<Response> {
  return apiClient.delete(`workspace/invite/${inviteId}`).then(r => r.data);
}

export function useDeleteInvite() {
  return useMutation((props: Props) => deleteInvite(props), {
    onSuccess: () => {
      queryClient.invalidateQueries(useUserNotifications.key);
      toast(message('Declined workspace invitation'));
    },
    onError: e => {
      if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
        queryClient.invalidateQueries(useUserNotifications.key);
        toast.danger(message('This invite is no longer valid'));
      } else {
        showHttpErrorToast(e);
      }
    },
  });
}
