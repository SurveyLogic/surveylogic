import {Breadcrumb} from '../../ui/breadcrumbs/breadcrumb';
import {BreadcrumbItem} from '../../ui/breadcrumbs/breadcrumb-item';
import {Trans} from '../../i18n/trans';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {BillingPlanPanel} from './billing-plan-panel';
import {Fragment} from 'react';
import {useProducts} from '../pricing-table/use-products';
import {Link, Navigate, useParams} from 'react-router-dom';
import {Button} from '../../ui/buttons/button';
import {FormattedPrice} from '../../i18n/formatted-price';
import {useBillingUser} from './use-billing-user';
import {FormattedDate} from '../../i18n/formatted-date';
import {useChangeSubscriptionPlan} from './requests/use-change-subscription-plan';

const previousUrl = '/billing/change-plan';

export function ConfirmPlanChangePage() {
  const {productId, priceId} = useParams();
  const navigate = useNavigate();
  const query = useProducts();
  const {subscription} = useBillingUser();
  const changePlan = useChangeSubscriptionPlan();

  if (!query.data || subscription?.price_id == priceId) {
    return <Navigate to="/billing/change-plan" replace />;
  }

  const newProduct = query.data.products.find(p => `${p.id}` === productId);
  const newPrice = newProduct?.prices.find(p => `${p.id}` === priceId);

  if (!newProduct || !newPrice || !subscription) {
    navigate(previousUrl);
    return null;
  }

  const newDate = (
    <span className="whitespace-nowrap">
      <FormattedDate date={subscription.renews_at} preset="long" />;
    </span>
  );

  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem isLink onSelected={() => navigate('/billing')}>
          <Trans message="Billing" />
        </BreadcrumbItem>
        <BreadcrumbItem onSelected={() => navigate(previousUrl)}>
          <Trans message="Plans" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Trans message="Confirm" />
        </BreadcrumbItem>
      </Breadcrumb>
      <h1 className="text-3xl font-bold my-32 md:my-64">
        <Trans message="Confirm your new plan" />
      </h1>
      <BillingPlanPanel title={<Trans message="Changing to" />}>
        <div className="max-w-[464px]">
          <div className="text-xl font-bold">{newProduct.name}</div>
          <FormattedPrice price={newPrice} className="text-lg" />
          <div className="text-base mt-12 border-b pb-24 mb-48">
            <Trans
              message="You will be charged the new price starting :date"
              values={{date: newDate}}
            />
          </div>
          <div>
            <div>
              <Button
                variant="flat"
                color="primary"
                size="md"
                className="w-full mb-16"
                onClick={() => {
                  changePlan.mutate({
                    subscriptionId: subscription.id,
                    newProductId: newProduct.id,
                    newPriceId: newPrice.id,
                  });
                }}
                disabled={changePlan.isLoading}
              >
                <Trans message="Confirm" />
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
              <Trans message="By confirming your new plan, you agree to our terms of Service and privacy policy." />
            </div>
          </div>
        </div>
      </BillingPlanPanel>
    </Fragment>
  );
}
