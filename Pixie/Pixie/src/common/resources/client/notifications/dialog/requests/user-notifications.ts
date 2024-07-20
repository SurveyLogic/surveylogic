import {useQuery} from '@tanstack/react-query';
import {PaginatedBackendResponse} from '../../../http/backend-response/pagination-response';
import {DatabaseNotification} from '../../database-notification';
import {apiClient} from '../../../http/query-client';

const Endpoint = 'notifications';

export interface FetchUserNotificationsResponse
  extends PaginatedBackendResponse<DatabaseNotification> {
  //
}

interface Payload {
  perPage?: number;
}

export function useUserNotifications(payload?: Payload) {
  return useQuery(useUserNotifications.key, () =>
    fetchUserNotifications(payload)
  );
}

function fetchUserNotifications(
  payload?: Payload
): Promise<FetchUserNotificationsResponse> {
  return apiClient
    .get(Endpoint, {params: payload})
    .then(response => response.data);
}

useUserNotifications.key = [Endpoint];
