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
}

export function useResumeSubscription() {
  const {trans} = useTrans();
  return useMutation((props: Payload) => resumeSubscription(props), {
    onSuccess: () => {
      toast(trans(message('Subscription renewed.')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function resumeSubscription({subscriptionId}: Payload): Promise<Response> {
  return apiClient
    .post(`billing/subscriptions/${subscriptionId}/resume`)
    .then(r => r.data);
}
