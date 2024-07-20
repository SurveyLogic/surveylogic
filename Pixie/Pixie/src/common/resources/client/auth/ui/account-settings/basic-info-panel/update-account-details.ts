import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {toast} from '@common/ui/toast/toast';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {User} from '@common/auth/user';
import {message} from '@common/i18n/message';
import {apiClient} from '@common/http/query-client';

interface Response extends BackendResponse {}

interface Payload {
  first_name?: string;
  last_name?: string;
}

export function useUpdateAccountDetails(form: UseFormReturn<Partial<User>>) {
  return useMutation((props: Payload) => updateAccountDetails(props), {
    onSuccess: () => {
      toast(message('Updated account details'));
    },
    onError: r => onFormQueryError(r, form),
  });
}

function updateAccountDetails(payload: Payload): Promise<Response> {
  return apiClient.put('users/me', payload).then(r => r.data);
}
