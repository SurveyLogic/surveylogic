import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {apiClient} from '../../http/query-client';
import {useAuth} from '../use-auth';
import {useBootstrapData} from '../../core/bootstrap-data/bootstrap-data-context';

interface Response extends BackendResponse {
  bootstrapData: string;
}

export interface ConnectSocialPayload {
  password: string;
}

export function useConnectSocialWithPassword(
  form: UseFormReturn<ConnectSocialPayload>
) {
  const navigate = useNavigate();
  const {getRedirectUri} = useAuth();
  const {setBootstrapData} = useBootstrapData();
  return useMutation(connect, {
    onSuccess: response => {
      setBootstrapData(response.bootstrapData);
      navigate(getRedirectUri(), {replace: true});
    },
    onError: r => onFormQueryError(r, form),
  });
}

function connect(payload: ConnectSocialPayload): Promise<Response> {
  return apiClient
    .post('secure/auth/social/connect', payload)
    .then(response => response.data);
}
