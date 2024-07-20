import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {User} from '@common/auth/user';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {
  user: User;
}

export interface BanUserPayload {
  ban_until?: string;
  permanent?: boolean;
  comment?: string;
}

export function useBanUser(
  form: UseFormReturn<BanUserPayload>,
  userId: number
) {
  return useMutation((payload: BanUserPayload) => banUser(userId, payload), {
    onSuccess: () => {
      toast(message('User suspended'));
      queryClient.invalidateQueries(['users']);
    },
    onError: r => onFormQueryError(r, form),
  });
}

function banUser(userId: number, payload: BanUserPayload): Promise<Response> {
  return apiClient.post(`users/${userId}/ban`, payload).then(r => r.data);
}
