import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {toast} from '../../ui/toast/toast';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient, queryClient} from '../../http/query-client';
import {message} from '../../i18n/message';
import {DatatableDataQueryKey} from '../../datatable/requests/paginated-resources';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {Localization} from '../../i18n/localization';

interface Response extends BackendResponse {
  localization: Localization;
}

export interface CreateLocalizationPayload {
  name: string;
  language: string;
}

function createLocalization(
  payload: CreateLocalizationPayload
): Promise<Response> {
  return apiClient.post(`localizations`, payload).then(r => r.data);
}

export function useCreateLocalization(
  form: UseFormReturn<CreateLocalizationPayload>
) {
  return useMutation(
    (props: CreateLocalizationPayload) => createLocalization(props),
    {
      onSuccess: () => {
        toast(message('Localization created'));
        queryClient.invalidateQueries(DatatableDataQueryKey('localizations'));
      },
      onError: r => onFormQueryError(r, form),
    }
  );
}
