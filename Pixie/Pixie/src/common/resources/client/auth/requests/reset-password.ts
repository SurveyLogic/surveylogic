import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {toast} from '../../ui/toast/toast';
import {message} from '../../i18n/message';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {apiClient} from '../../http/query-client';

interface Response extends BackendResponse {
  bootstrapData: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

function reset(payload: ResetPasswordPayload): Promise<Response> {
  return apiClient
    .post('auth/reset-password', payload)
    .then(response => response.data);
}

export function useResetPassword(form: UseFormReturn<ResetPasswordPayload>) {
  const navigate = useNavigate();
  return useMutation(reset, {
    onSuccess: () => {
      navigate('/login', {replace: true});
      toast(message('Your password has been reset!'));
    },
    onError: r => onFormQueryError(r, form),
  });
}
