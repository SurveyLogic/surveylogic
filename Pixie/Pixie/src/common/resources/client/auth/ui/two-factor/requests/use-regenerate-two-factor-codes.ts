import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useRegenerateTwoFactorCodes() {
  return useMutation(() => regenerate(), {
    onError: r => showHttpErrorToast(r),
  });
}

function regenerate(): Promise<Response> {
  return apiClient
    .post('auth/user/two-factor-recovery-codes')
    .then(response => response.data);
}
