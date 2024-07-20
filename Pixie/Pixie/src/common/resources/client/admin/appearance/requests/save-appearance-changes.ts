import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {AppearanceValues} from '../appearance-store';
import {toast} from '../../../ui/toast/toast';
import {apiClient} from '../../../http/query-client';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {}

function saveAppearanceChanges(
  changes: Partial<AppearanceValues>
): Promise<Response> {
  return apiClient.post(`admin/appearance`, {changes}).then(r => r.data);
}

export function useSaveAppearanceChanges() {
  return useMutation(
    (values: Partial<AppearanceValues>) => {
      return saveAppearanceChanges(values);
    },
    {
      onSuccess: () => {
        toast(message('Changes saved'));
      },
      onError: err => showHttpErrorToast(err),
    }
  );
}
