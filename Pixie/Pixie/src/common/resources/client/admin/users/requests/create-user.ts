import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {User} from '../../../auth/user';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {apiClient, queryClient} from '../../../http/query-client';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {onFormQueryError} from '../../../errors/on-form-query-error';
import {message} from '../../../i18n/message';
import {useNavigate} from '../../../utils/hooks/use-navigate';

interface Response extends BackendResponse {
  user: User;
}

export interface CreateUserPayload
  extends Omit<Partial<User>, 'email_verified_at'> {
  email_verified_at?: boolean;
}

export function useCreateUser(form: UseFormReturn<CreateUserPayload>) {
  const navigate = useNavigate();
  return useMutation((props: CreateUserPayload) => createUser(props), {
    onSuccess: () => {
      toast(message('User created'));
      queryClient.invalidateQueries(DatatableDataQueryKey('users'));
      navigate('/admin/users');
    },
    onError: r => onFormQueryError(r, form),
  });
}

function createUser(payload: CreateUserPayload): Promise<Response> {
  if (payload.roles) {
    payload.roles = payload.roles.map(r => r.id) as any;
  }
  return apiClient.post('users', payload).then(r => r.data);
}
