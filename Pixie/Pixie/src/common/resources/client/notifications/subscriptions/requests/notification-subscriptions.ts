import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {
  NotificationSubscription,
  NotificationSubscriptionGroup,
} from '../notification-subscription';
import {apiClient} from '../../../http/query-client';

export interface FetchNotificationSubscriptionsResponse
  extends BackendResponse {
  available_channels: string[];
  subscriptions: NotificationSubscriptionGroup[];
  user_selections: NotificationSubscription[];
}

function fetchNotificationSubscriptions(): Promise<FetchNotificationSubscriptionsResponse> {
  return apiClient
    .get('notifications/me/subscriptions')
    .then(response => response.data);
}

export function useNotificationSubscriptions() {
  return useQuery(
    ['notification-subscriptions'],
    () => fetchNotificationSubscriptions(),
    {staleTime: Infinity}
  );
}
