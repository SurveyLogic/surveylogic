import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../http/query-client';
import {useTrans} from '../../../i18n/use-trans';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {onFormQueryError} from '../../../errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {Subscription} from '../../../billing/subscription';

interface Response extends BackendResponse {
  subscription: Subscription;
}

export interface UpdateSubscriptionPayload extends Partial<Subscription> {
  id: number;
}

export function useUpdateSubscription(
  form: UseFormReturn<UpdateSubscriptionPayload>
) {
  const {trans} = useTrans();
  return useMutation(
    (props: UpdateSubscriptionPayload) => updateSubscription(props),
    {
      onSuccess: () => {
        toast(trans(message('Subscription updated')));
        queryClient.invalidateQueries(
          DatatableDataQueryKey('billing/subscriptions')
        );
      },
      onError: err => onFormQueryError(err, form),
    }
  );
}

function updateSubscription({
  id,
  ...payload
}: UpdateSubscriptionPayload): Promise<Response> {
  return apiClient
    .put(`billing/subscriptions/${id}`, payload)
    .then(r => r.data);
}
