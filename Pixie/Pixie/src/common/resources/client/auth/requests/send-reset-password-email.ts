import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {toast} from '../../ui/toast/toast';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {apiClient} from '../../http/query-client';

interface Response extends BackendResponse {
  message: string;
}

export interface SendPasswordResetEmailPayload {
  email: string;
}

export function useSendPasswordResetEmail(
  form: UseFormReturn<SendPasswordResetEmailPayload>
) {
  const navigate = useNavigate();
  return useMutation(sendResetPasswordEmail, {
    onSuccess: response => {
      toast(response.message);
      navigate('/login');
    },
    onError: r => onFormQueryError(r, form),
  });
}

function sendResetPasswordEmail(
  payload: SendPasswordResetEmailPayload
): Promise<Response> {
  return apiClient
    .post('auth/forgot-password', payload)
    .then(response => response.data);
}
