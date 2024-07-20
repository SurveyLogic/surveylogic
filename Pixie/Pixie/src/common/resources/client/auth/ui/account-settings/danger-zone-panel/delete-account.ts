import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {useLogout} from '../../../requests/logout';
import {toast} from '../../../../ui/toast/toast';
import {useAuth} from '../../../use-auth';
import {apiClient} from '../../../../http/query-client';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

function deleteAccount(userId: number): Promise<Response> {
  return apiClient
    .delete(`users/${userId}`, {params: {deleteCurrentUser: true}})
    .then(r => r.data);
}

export function useDeleteAccount() {
  const {user} = useAuth();
  const logout = useLogout();
  return useMutation(() => deleteAccount(user!.id), {
    onSuccess: () => {
      toast('Account deleted');
      logout.mutate();
    },
    onError: err => showHttpErrorToast(err),
  });
}
