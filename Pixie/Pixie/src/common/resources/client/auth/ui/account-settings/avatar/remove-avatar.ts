import {useMutation} from '@tanstack/react-query';
import {toast} from '../../../../ui/toast/toast';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {User} from '../../../user';
import {message} from '../../../../i18n/message';
import {apiClient} from '../../../../http/query-client';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface UserProps {
  user: User;
}

function removeAvatar(user: User): Promise<Response> {
  return apiClient.delete(`users/${user.id}/avatar`).then(r => r.data);
}

export function useRemoveAvatar({user}: UserProps) {
  return useMutation(() => removeAvatar(user), {
    onSuccess: () => {
      toast(message('Removed avatar'));
    },
    onError: err => showHttpErrorToast(err),
  });
}
