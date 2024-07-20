import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {Workspace} from '../types/workspace';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {message} from '../../i18n/message';

interface Response extends BackendResponse {
  workspace: Workspace;
}

export interface UpdateWorkspacePayload {
  id: number;
  name: string;
}

function updateWorkspace({
  id,
  ...props
}: UpdateWorkspacePayload): Promise<Response> {
  return apiClient.put(`workspace/${id}`, props).then(r => r.data);
}

export function useUpdateWorkspace(
  form: UseFormReturn<UpdateWorkspacePayload>
) {
  const {close} = useDialogContext();
  return useMutation(
    (props: UpdateWorkspacePayload) => updateWorkspace(props),
    {
      onSuccess: response => {
        close();
        toast(message('Updated workspace'));
        queryClient.invalidateQueries(WorkspaceQueryKeys.fetchUserWorkspaces);
        queryClient.invalidateQueries(
          WorkspaceQueryKeys.workspaceWithMembers(response.workspace.id)
        );
      },
      onError: r => onFormQueryError(r, form),
    }
  );
}
