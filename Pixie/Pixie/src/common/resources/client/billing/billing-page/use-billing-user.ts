import {useUser} from '../../auth/ui/use-user';
import {queryClient} from '@common/http/query-client';

export function useBillingUser() {
  const query = useUser('me', {
    with: ['subscriptions.product', 'subscriptions.price'],
  });

  const subscription = query.data?.user.subscriptions?.[0];

  return {subscription, isLoading: query.isLoading, user: query.data?.user};
}

export function invalidateBillingUserQuery() {
  queryClient.invalidateQueries(['users']);
}
