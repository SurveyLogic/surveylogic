import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';

interface Response extends BackendResponse {
  result: 'connected' | null;
}

interface Payload {
  host: string;
}

export function useValidateDomainDns() {
  return useMutation((props: Payload) => authorize(props));
}

function authorize(payload: Payload): Promise<Response> {
  return apiClient
    .post('secure/custom-domain/validate/2BrM45vvfS/api', payload)
    .then(r => r.data);
}
