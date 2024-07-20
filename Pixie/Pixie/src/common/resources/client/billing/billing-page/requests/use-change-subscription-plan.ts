import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../../http/query-client';
import {useTrans} from '../../../i18n/use-trans';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {User} from '../../../auth/user';
import {invalidateBillingUserQuery} from '../use-billing-user';
import {useNavigate} from '../../../utils/hooks/use-navigate';
import {showHttpErrorToast} from '../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  user: User;
}

interface Payload {
  subscriptionId: number;
  newProductId: number;
  newPriceId: number;
}

export function useChangeSubscriptionPlan() {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation((props: Payload) => changePlan(props), {
    onSuccess: () => {
      toast(trans(message('Plan changed.')));
      invalidateBillingUserQuery();
      navigate('/billing');
    },
    onError: err => showHttpErrorToast(err),
  });
}

function changePlan({subscriptionId, ...other}: Payload): Promise<Response> {
  return apiClient
    .post(`billing/subscriptions/${subscriptionId}/change-plan`, other)
    .then(r => r.data);
}
