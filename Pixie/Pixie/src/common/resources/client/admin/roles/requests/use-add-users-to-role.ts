import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../../http/query-client';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {Role} from '../../../auth/role';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Payload {
  userIds: number[];
}

export function useAddUsersToRole(role: Role) {
  return useMutation(
    ({userIds}: Payload) => addUsersToRole({userIds, roleId: role.id}),
    {
      onSuccess: (response, payload) => {
        toast(
          message('Assigned [one 1 user|other :count users] to {role}', {
            values: {count: payload.userIds.length, role: role.name},
          })
        );
      },
      onError: err => showHttpErrorToast(err),
    }
  );
}

function addUsersToRole({
  roleId,
  userIds,
}: Payload & {roleId: number}): Promise<Response> {
  return apiClient
    .post(`roles/${roleId}/add-users`, {userIds})
    .then(r => r.data);
}
