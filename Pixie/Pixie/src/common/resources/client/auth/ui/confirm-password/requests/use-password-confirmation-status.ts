import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient, queryClient} from '@common/http/query-client';

interface Response extends BackendResponse {
  confirmed: boolean;
}

export function usePasswordConfirmationStatus() {
  return useQuery(['password-confirmation-status'], () => fetchStatus());
}

function fetchStatus(): Promise<Response> {
  return apiClient
    .get('auth/user/confirmed-password-status', {params: {seconds: 9000}})
    .then(response => response.data);
}

export function setPasswordConfirmationStatus(confirmed: boolean) {
  queryClient.setQueryData(['password-confirmation-status'], {confirmed});
}
