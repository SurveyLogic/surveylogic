import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

interface Payload {
  entryIds?: number[];
  deleteForever?: boolean;
  paths?: string[];
}

function deleteFileEntries(payload: Payload): Promise<Response> {
  return apiClient.post('file-entries/delete', payload).then(r => r.data);
}

export function useDeleteFileEntries() {
  return useMutation((props: Payload) => deleteFileEntries(props), {
    onError: err => showHttpErrorToast(err),
  });
}
