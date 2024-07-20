import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@common/i18n/message';
import {apiClient} from '@common/http/query-client';

interface Response extends BackendResponse {}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export function useUpdatePassword(form: UseFormReturn<UpdatePasswordPayload>) {
  return useMutation((props: UpdatePasswordPayload) => updatePassword(props), {
    onSuccess: () => {
      toast(message('Password changed'));
    },
    onError: r => onFormQueryError(r, form),
  });
}

function updatePassword(payload: UpdatePasswordPayload): Promise<Response> {
  return apiClient.put('auth/user/password', payload).then(r => r.data);
}
