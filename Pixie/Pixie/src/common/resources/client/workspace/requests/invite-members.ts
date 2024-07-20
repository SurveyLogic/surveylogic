import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {WorkspaceInvite} from '../types/workspace-invite';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  invites: WorkspaceInvite[];
}

interface Props {
  workspaceId: number;
  emails: string[];
  roleId: number;
}

function InviteMembers({workspaceId, ...other}: Props): Promise<Response> {
  return apiClient
    .post(`workspace/${workspaceId}/invite`, other)
    .then(r => r.data);
}

export function useInviteMembers() {
  return useMutation((props: Props) => InviteMembers(props), {
    onSuccess: (response, props) => {
      queryClient.invalidateQueries(
        WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      );
    },
    onError: err => showHttpErrorToast(err),
  });
}
