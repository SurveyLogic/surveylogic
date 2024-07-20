import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {useActiveWorkspaceId} from '../active-workspace-id-context';
import {PersonalWorkspace} from '../user-workspaces';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export interface DeleteWorkspacePayload {
  id: number;
}

function deleteWorkspace({id}: DeleteWorkspacePayload): Promise<Response> {
  return apiClient.delete(`workspace/${id}`).then(r => r.data);
}

export function useDeleteWorkspace() {
  const {workspaceId, setWorkspaceId} = useActiveWorkspaceId();
  return useMutation(
    (props: DeleteWorkspacePayload) => deleteWorkspace(props),
    {
      onSuccess: (r, payload) => {
        toast(message('Deleted workspace'));
        queryClient.invalidateQueries(WorkspaceQueryKeys.fetchUserWorkspaces);
        queryClient.invalidateQueries(
          WorkspaceQueryKeys.workspaceWithMembers(payload.id)
        );

        // if user deleted workspace that is currently active, switch to personal workspace
        if (workspaceId === payload.id) {
          setWorkspaceId(PersonalWorkspace.id);
        }
      },
      onError: err => showHttpErrorToast(err),
    }
  );
}
