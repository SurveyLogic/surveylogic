import {Breadcrumb} from '../../ui/breadcrumbs/breadcrumb';
import {BreadcrumbItem} from '../../ui/breadcrumbs/breadcrumb-item';
import {Trans} from '../../i18n/trans';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {BillingPlanPanel} from './billing-plan-panel';
import {Fragment} from 'react';
import {useProducts} from '../pricing-table/use-products';
import {Link} from 'react-router-dom';
import {Button} from '../../ui/buttons/button';
import {FormattedPrice} from '../../i18n/formatted-price';
import {invalidateBillingUserQuery, useBillingUser} from './use-billing-user';
import {useCancelSubscription} from './requests/use-cancel-subscription';
import {FormattedDate} from '../../i18n/formatted-date';

const previousUrl = '/billing';

export function ConfirmPlanCancellationPage() {
  const navigate = useNavigate();
  const query = useProducts();
  const {subscription} = useBillingUser();
  const cancelSubscription = useCancelSubscription();

  const product = subscription?.product;
  const price = subscription?.price;

  if (!query.data) {
    return null;
  }

  if (!subscription || !product || !price) {
    navigate(previousUrl);
    return null;
  }

  const renewDate = (
    <span className="whitespace-nowrap">
      <FormattedDate date={subscription.renews_at} preset="long" />
    </span>
  );

  const handleSubscriptionCancel = () => {
    cancelSubscription.mutate(
      {
        subscriptionId: subscription.id,
      },
      {
        onSuccess: () => {
          invalidateBillingUserQuery();
          navigate('/billing');
        },
      }
    );
  };

  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem isLink onSelected={() => navigate(previousUrl)}>
          <Trans message="Billing" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Trans message="Cancel" />
        </BreadcrumbItem>
      </Breadcrumb>
      <h1 className="text-3xl font-bold my-32 md:my-64">
        <Trans message="Cancel your plan" />
      </h1>
      <BillingPlanPanel title={<Trans message="Current plan" />}>
        <div className="max-w-[464px]">
          <div className="text-xl font-bold">{product.name}</div>
          <FormattedPrice price={price} className="text-lg" />
          <div className="text-base mt-12 border-b pb-24 mb-48">
            <Trans
              message="Your plan will be canceled, but is still available until the end of your billing period on :date"
              values={{date: renewDate}}
            />
            <div className="mt-20">
              <Trans message="If you change your mind, you can renew your subscription." />
            </div>
          </div>
          <div>
            <div>
              <Button
                variant="flat"
                color="primary"
                size="md"
                className="w-full mb-16"
                onClick={handleSubscriptionCancel}
                disabled={cancelSubscription.isLoading}
              >
                <Trans message="Cancel plan" />
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full"
                to={previousUrl}
                elementType={Link}
              >
                <Trans message="Go back" />
              </Button>
            </div>
            <div className="text-xs text-muted mt-12">
              <Trans message="By cancelling your plan, you agree to our terms of service and privacy policy." />
            </div>
          </div>
        </div>
      </BillingPlanPanel>
    </Fragment>
  );
}
