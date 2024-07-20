import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {apiClient, queryClient} from '../../http/query-client';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {Workspace} from '../types/workspace';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {message} from '../../i18n/message';

interface Response extends BackendResponse {
  workspace: Workspace;
}

interface Props {
  name: string;
}

export function useCreateWorkspace(form: UseFormReturn<Props>) {
  return useMutation((props: Props) => createWorkspace(props), {
    onSuccess: () => {
      toast(message('Created workspace'));
      queryClient.invalidateQueries(WorkspaceQueryKeys.fetchUserWorkspaces);
    },
    onError: r => onFormQueryError(r, form),
  });
}

function createWorkspace(props: Props): Promise<Response> {
  return apiClient.post('workspace', props).then(r => r.data);
}
