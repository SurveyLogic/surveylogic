import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {WorkspaceMember} from '../types/workspace-member';
import {WorkspaceInvite} from '../types/workspace-invite';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Props {
  workspaceId: number;
  member: WorkspaceMember | WorkspaceInvite;
  roleId: number;
}

function ChangeRole({workspaceId, member, ...other}: Props): Promise<Response> {
  const modelType = member.model_type;
  const memberId =
    member.model_type === 'invite' ? member.id : member.member_id;
  return apiClient
    .post(
      `workspace/${workspaceId}/${modelType}/${memberId}/change-role`,
      other
    )
    .then(r => r.data);
}

export function useChangeRole() {
  return useMutation((props: Props) => ChangeRole(props), {
    onSuccess: (response, props) => {
      toast(message('Role changed'));
      queryClient.invalidateQueries(
        WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      );
    },
    onError: err => showHttpErrorToast(err),
  });
}
