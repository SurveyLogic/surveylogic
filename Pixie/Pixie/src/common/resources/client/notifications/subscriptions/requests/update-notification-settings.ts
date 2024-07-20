import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {apiClient, queryClient} from '../../../http/query-client';
import {message} from '../../../i18n/message';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  //
}

type UpdateNotificationSettingsPayload = {
  notif_id: string;
  channels: Record<string, boolean>;
}[];

function UpdateNotificationSettings(
  payload: UpdateNotificationSettingsPayload
): Promise<Response> {
  return apiClient
    .put('notifications/me/subscriptions', {selections: payload})
    .then(r => r.data);
}

export function useUpdateNotificationSettings() {
  return useMutation(
    (payload: UpdateNotificationSettingsPayload) =>
      UpdateNotificationSettings(payload),
    {
      onSuccess: () => {
        toast(message('Updated preferences'));
        queryClient.invalidateQueries(['notification-subscriptions']);
      },
      onError: err => showHttpErrorToast(err),
    }
  );
}
