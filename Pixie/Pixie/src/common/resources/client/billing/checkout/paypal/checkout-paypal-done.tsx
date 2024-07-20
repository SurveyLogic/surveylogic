import {CheckoutLayout} from '../checkout-layout';
import {useParams, useSearchParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {message} from '@common/i18n/message';
import {CheckoutProductSummary} from '../checkout-product-summary';
import {
  BillingRedirectMessage,
  BillingRedirectMessageConfig,
} from '../../billing-redirect-message';
import {apiClient} from '@common/http/query-client';
import {useBootstrapData} from '@common/core/bootstrap-data/bootstrap-data-context';

export function CheckoutPaypalDone() {
  const {invalidateBootstrapData} = useBootstrapData();
  const {productId, priceId} = useParams();
  const [params] = useSearchParams();

  const [messageConfig, setMessageConfig] =
    useState<BillingRedirectMessageConfig>();

  useEffect(() => {
    const subscriptionId = params.get('subscriptionId');
    const status = params.get('status');
    setMessageConfig(getRedirectMessageConfig(status, productId, priceId));
    if (subscriptionId && status === 'success') {
      storeSubscriptionDetailsLocally(subscriptionId).then(() => {
        invalidateBootstrapData();
      });
    }
  }, [priceId, productId, params, invalidateBootstrapData]);

  return (
    <CheckoutLayout>
      <BillingRedirectMessage config={messageConfig} />
      <CheckoutProductSummary showBillingLine={false} />
    </CheckoutLayout>
  );
}

function getRedirectMessageConfig(
  status?: 'success' | 'error' | string | null,
  productId?: string,
  priceId?: string
): BillingRedirectMessageConfig {
  switch (status) {
    case 'success':
      return {
        message: message('Subscription successful!'),
        status: 'success',
        buttonLabel: message('Return to site'),
        link: '/billing',
      };
    default:
      return {
        message: message('Something went wrong. Please try again.'),
        status: 'error',
        buttonLabel: message('Go back'),
        link: errorLink(productId, priceId),
      };
  }
}

function errorLink(productId?: string, priceId?: string): string {
  return productId && priceId ? `/buy/${productId}/${priceId}` : '/';
}

function storeSubscriptionDetailsLocally(subscriptionId: string) {
  return apiClient.post('billing/paypal/store-subscription-details-locally', {
    paypal_subscription_id: subscriptionId,
  });
}
