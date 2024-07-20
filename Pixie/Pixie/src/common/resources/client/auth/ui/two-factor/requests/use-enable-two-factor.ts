import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useEnableTwoFactor() {
  return useMutation(enable, {
    onError: r => showHttpErrorToast(r),
  });
}

function enable(): Promise<Response> {
  return apiClient
    .post('auth/user/two-factor-authentication')
    .then(response => response.data);
}
