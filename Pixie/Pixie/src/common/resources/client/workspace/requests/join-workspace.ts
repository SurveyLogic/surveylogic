import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {Workspace} from '../types/workspace';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {useActiveWorkspaceId} from '../active-workspace-id-context';
import {useUserNotifications} from '../../notifications/dialog/requests/user-notifications';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  workspace: Workspace;
}

interface Props {
  inviteId: string;
}

export function useJoinWorkspace() {
  const {setWorkspaceId} = useActiveWorkspaceId() || {};
  return useMutation((props: Props) => joinWorkspace(props), {
    onSuccess: response => {
      toast(message('Joined workspace'));
      setWorkspaceId(response.workspace.id);
      queryClient.invalidateQueries(WorkspaceQueryKeys.fetchUserWorkspaces);
      queryClient.invalidateQueries(useUserNotifications.key);
    },
    onError: e => {
      if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
        queryClient.invalidateQueries(useUserNotifications.key);
        toast.danger(message('This invite is no longer valid'));
      } else {
        showHttpErrorToast(e);
      }
    },
  });
}

function joinWorkspace({inviteId}: Props): Promise<Response> {
  return apiClient.get(`workspace/join/${inviteId}`).then(r => r.data);
}
