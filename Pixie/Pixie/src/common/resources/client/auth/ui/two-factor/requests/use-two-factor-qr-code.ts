import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';

interface Response extends BackendResponse {
  svg: string;
  secret: string;
}

export function useTwoFactorQrCode() {
  return useQuery(['two-factor-qr-code'], () => fetchCode());
}

function fetchCode(): Promise<Response> {
  return apiClient
    .get('auth/user/two-factor/qr-code')
    .then(response => response.data);
}
