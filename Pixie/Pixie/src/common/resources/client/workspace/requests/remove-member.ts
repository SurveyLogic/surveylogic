import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient, queryClient} from '../../http/query-client';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {useAuth} from '../../auth/use-auth';
import {useActiveWorkspaceId} from '../active-workspace-id-context';
import {PersonalWorkspace} from '../user-workspaces';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Props {
  workspaceId: number;
  memberId: number | string;
  memberType: 'invite' | 'member';
}

function removeMember({
  workspaceId,
  memberId,
  memberType,
}: Props): Promise<Response> {
  const endpoint =
    memberType === 'invite'
      ? `workspace/invite/${memberId}`
      : `workspace/${workspaceId}/member/${memberId}`;
  return apiClient.delete(endpoint).then(r => r.data);
}

export function useRemoveMember() {
  const {workspaceId, setWorkspaceId} = useActiveWorkspaceId();
  const {user} = useAuth();
  return useMutation((props: Props) => removeMember(props), {
    onSuccess: (response, props) => {
      queryClient.invalidateQueries(WorkspaceQueryKeys.fetchUserWorkspaces);
      queryClient.invalidateQueries(
        WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      );

      // if user left workspace that is currently active, switch to personal workspace
      if (props.memberId === user?.id && workspaceId === props.workspaceId) {
        setWorkspaceId(PersonalWorkspace.id);
      }
    },
    onError: err => showHttpErrorToast(err),
  });
}
