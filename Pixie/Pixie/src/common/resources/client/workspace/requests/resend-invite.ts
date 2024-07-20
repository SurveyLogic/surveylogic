import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {WorkspaceInvite} from '../types/workspace-invite';
import {toast} from '../../ui/toast/toast';
import {apiClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  invite: WorkspaceInvite;
}

interface Props {
  workspaceId: number;
  inviteId: string;
}

function ResendInvite({
  workspaceId,
  inviteId,
  ...other
}: Props): Promise<Response> {
  return apiClient
    .post(`workspace/${workspaceId}/${inviteId}/resend`, other)
    .then(r => r.data);
}

export function useResendInvite() {
  return useMutation((props: Props) => ResendInvite(props), {
    onSuccess: () => {
      toast('Invite sent');
    },
    onError: err => showHttpErrorToast(err),
  });
}
