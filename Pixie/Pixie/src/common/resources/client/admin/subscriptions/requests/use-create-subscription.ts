import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../http/query-client';
import {useTrans} from '../../../i18n/use-trans';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {Tag} from '../../../tags/tag';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {onFormQueryError} from '../../../errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {Subscription} from '../../../billing/subscription';

const endpoint = 'billing/subscriptions';

interface Response extends BackendResponse {
  tag: Tag;
}

interface Payload extends Partial<Subscription> {}

export function useCreateSubscription(form: UseFormReturn<Payload>) {
  const {trans} = useTrans();
  return useMutation((props: Payload) => createNewSubscription(props), {
    onSuccess: () => {
      toast(trans(message('Subscription created')));
      queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
    },
    onError: err => onFormQueryError(err, form),
  });
}

function createNewSubscription(payload: Payload): Promise<Response> {
  return apiClient.post(endpoint, payload).then(r => r.data);
}
