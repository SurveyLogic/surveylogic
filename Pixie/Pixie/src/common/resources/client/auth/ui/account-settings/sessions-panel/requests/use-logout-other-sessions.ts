import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Payload {
  password: string;
}

export function useLogoutOtherSessions() {
  return useMutation((payload: Payload) => logoutOther(payload), {
    onError: r => showHttpErrorToast(r),
  });
}

function logoutOther(payload: Payload): Promise<Response> {
  return apiClient
    .post('user-sessions/logout-other', payload)
    .then(response => response.data);
}
