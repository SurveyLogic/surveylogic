import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../../http/query-client';
import {useTrans} from '../../../i18n/use-trans';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {User} from '../../../auth/user';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  user: User;
}

interface Payload {
  subscriptionId: number;
  delete?: boolean;
}

export function useCancelSubscription() {
  const {trans} = useTrans();
  return useMutation((props: Payload) => cancelSubscription(props), {
    onSuccess: (response, payload) => {
      toast(
        payload.delete
          ? trans(message('Subscription deleted.'))
          : trans(message('Subscription cancelled.'))
      );
    },
    onError: err => showHttpErrorToast(err),
  });
}

function cancelSubscription({
  subscriptionId,
  ...payload
}: Payload): Promise<Response> {
  return apiClient
    .post(`billing/subscriptions/${subscriptionId}/cancel`, payload)
    .then(r => r.data);
}
