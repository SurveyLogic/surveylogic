import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient, queryClient} from '../../http/query-client';
import {useUserNotifications} from '../dialog/requests/user-notifications';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';
import {useBootstrapData} from '../../core/bootstrap-data/bootstrap-data-context';

interface Response extends BackendResponse {
  unreadCount: number;
}

interface Payload {
  ids: string[];
}

export function useMarkNotificationsAsRead() {
  const {data, mergeBootstrapData} = useBootstrapData();
  return useMutation((props: Payload) => UseMarkNotificationsAsRead(props), {
    onSuccess: response => {
      queryClient.invalidateQueries(useUserNotifications.key);
      if (response.unreadCount === 0) {
        mergeBootstrapData({
          user: {...data.user!, unread_notifications_count: 0},
        });
      }
    },
    onError: err => showHttpErrorToast(err),
  });
}

function UseMarkNotificationsAsRead(payload: Payload): Promise<Response> {
  return apiClient
    .post('notifications/mark-as-read', payload)
    .then(r => r.data);
}
