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

export function useRemoveUsersFromRole(role: Role) {
  return useMutation(
    ({userIds}: Payload) => removeUsersFromRole({userIds, roleId: role.id}),
    {
      onSuccess: (response, payload) => {
        toast(
          message('Removed [one 1 user|other :count users] from “{role}“', {
            values: {count: payload.userIds.length, role: role.name},
          })
        );
      },
      onError: err => showHttpErrorToast(err),
    }
  );
}

function removeUsersFromRole({
  roleId,
  userIds,
}: Payload & {roleId: number}): Promise<Response> {
  return apiClient
    .post(`roles/${roleId}/remove-users`, {userIds})
    .then(r => r.data);
}
