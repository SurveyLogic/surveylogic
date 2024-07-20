import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {useMutation} from '@tanstack/react-query';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  downloadPath?: string;
  result?: 'jobQueued';
}

export type ExportCsvPayload = Record<string, string | number | undefined>;

export function useExportCsv(endpoint: string) {
  return useMutation(
    (payload: ExportCsvPayload | undefined) => exportCsv(endpoint, payload),
    {
      onError: err => showHttpErrorToast(err),
    }
  );
}

function exportCsv(
  endpoint: string,
  payload: ExportCsvPayload | undefined
): Promise<Response> {
  return apiClient.post(endpoint, payload).then(r => r.data);
}
