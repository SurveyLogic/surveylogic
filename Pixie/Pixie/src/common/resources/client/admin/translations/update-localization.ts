import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {toast} from '../../ui/toast/toast';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient, queryClient} from '../../http/query-client';
import {message} from '../../i18n/message';
import {DatatableDataQueryKey} from '../../datatable/requests/paginated-resources';
import {Localization} from '../../i18n/localization';
import {onFormQueryError} from '../../errors/on-form-query-error';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';
import {getLocalWithLinesQueryKey} from './use-locale-with-lines';

interface Response extends BackendResponse {
  localization: Localization;
}

function UpdateLocalization({
  id,
  ...other
}: Partial<Localization>): Promise<Response> {
  return apiClient.put(`localizations/${id}`, other).then(r => r.data);
}

export function useUpdateLocalization(
  form?: UseFormReturn<Partial<Localization>>
) {
  return useMutation(
    (props: Partial<Localization>) => UpdateLocalization(props),
    {
      onSuccess: () => {
        toast(message('Localization updated'));
        queryClient.invalidateQueries(DatatableDataQueryKey('localizations'));
        queryClient.invalidateQueries(getLocalWithLinesQueryKey());
      },
      onError: r => (form ? onFormQueryError(r, form) : showHttpErrorToast(r)),
    }
  );
}
