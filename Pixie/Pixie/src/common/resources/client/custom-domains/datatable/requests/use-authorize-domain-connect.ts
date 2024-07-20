import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';

interface Response extends BackendResponse {
  serverIp: string;
}

export interface AuthorizeDomainConnectPayload {
  host: string;
}

// check if is this host is not connected already and if user has permissions to connect domains
export function useAuthorizeDomainConnect(
  form: UseFormReturn<AuthorizeDomainConnectPayload>
) {
  return useMutation(
    (props: AuthorizeDomainConnectPayload) => authorize(props),
    {
      onError: err => onFormQueryError(err, form),
    }
  );
}

function authorize(payload: AuthorizeDomainConnectPayload): Promise<Response> {
  return apiClient
    .post('secure/custom-domain/authorize/store', payload)
    .then(r => r.data);
}
