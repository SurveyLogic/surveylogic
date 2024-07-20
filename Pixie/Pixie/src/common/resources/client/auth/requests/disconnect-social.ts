import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  //
}

interface Payload {
  service: string;
}

export function useDisconnectSocial() {
  return useMutation(disconnect, {
    onError: err => showHttpErrorToast(err),
  });
}

function disconnect(payload: Payload): Promise<Response> {
  return apiClient
    .post(`secure/auth/social/${payload.service}/disconnect`, payload)
    .then(response => response.data);
}
