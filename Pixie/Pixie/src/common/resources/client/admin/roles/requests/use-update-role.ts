import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../http/query-client';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {Role} from '../../../auth/role';
import {useTrans} from '../../../i18n/use-trans';
import {message} from '../../../i18n/message';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';
import {useNavigate} from '../../../utils/hooks/use-navigate';

interface Response extends BackendResponse {
  role: Role;
}

interface Payload extends Partial<Role> {
  id: number;
}

const Endpoint = (id: number) => `roles/${id}`;

export function useUpdateRole() {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation((payload: Payload) => updateRole(payload), {
    onSuccess: response => {
      toast(trans(message('Role updated')));
      queryClient.invalidateQueries([Endpoint(response.role.id)]);
      queryClient.invalidateQueries(DatatableDataQueryKey('roles'));
      navigate('/admin/roles');
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateRole({id, ...payload}: Payload): Promise<Response> {
  return apiClient.put(Endpoint(id), payload).then(r => r.data);
}
