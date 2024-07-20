import {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {loadStripe, SetupIntent} from '@stripe/stripe-js';
import {message} from '../../../i18n/message';
import {apiClient} from '../../../http/query-client';
import {useNavigate} from '../../../utils/hooks/use-navigate';
import {
  BillingRedirectMessage,
  BillingRedirectMessageConfig,
} from '../../billing-redirect-message';
import {invalidateBillingUserQuery} from '../use-billing-user';
import {useSettings} from '../../../core/settings/use-settings';

const previousUrl = '/billing';

export function ChangePaymentMethodDone() {
  const {
    billing: {stripe_public_key},
  } = useSettings();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const clientSecret = params.get('setup_intent_client_secret');

  const [messageConfig, setMessageConfig] =
    useState<BillingRedirectMessageConfig>();

  const stripeInitiated = useRef<boolean>();

  useEffect(() => {
    if (stripeInitiated.current || !clientSecret) return;
    loadStripe(stripe_public_key!).then(stripe => {
      if (!stripe) {
        setMessageConfig(getRedirectMessageConfig());
        return;
      }
      stripe.retrieveSetupIntent(clientSecret).then(({setupIntent}) => {
        if (setupIntent?.status === 'succeeded') {
          changeDefaultPaymentMethod(setupIntent.payment_method as string).then(
            () => {
              invalidateBillingUserQuery();
            }
          );
        }
        setMessageConfig(getRedirectMessageConfig(setupIntent?.status));
      });
    });
    stripeInitiated.current = true;
  }, [stripe_public_key, clientSecret]);

  if (!clientSecret) {
    navigate(previousUrl);
    return null;
  }

  return <BillingRedirectMessage config={messageConfig} />;
}

function getRedirectMessageConfig(
  status?: SetupIntent.Status
): BillingRedirectMessageConfig {
  switch (status) {
    case 'succeeded':
      return {
        ...redirectMessageDefaults,
        message: message('Payment method changed successfully!'),
        status: 'success',
      };
    case 'processing':
      return {
        ...redirectMessageDefaults,
        message: message(
          "Your request is processing. We'll update you when your payment method is confirmed."
        ),
        status: 'success',
      };
    case 'requires_payment_method':
      return {
        ...redirectMessageDefaults,
        message: message(
          'Payment method confirmation failed. Please try another payment method.'
        ),
        status: 'error',
      };
    default:
      return {
        ...redirectMessageDefaults,
        message: message('Something went wrong'),
        status: 'error',
      };
  }
}

const redirectMessageDefaults: Omit<
  BillingRedirectMessageConfig,
  'message' | 'status'
> = {
  link: previousUrl,
  buttonLabel: message('Go back'),
};

function changeDefaultPaymentMethod(paymentMethodId: string) {
  return apiClient.post('billing/stripe/change-default-payment-method', {
    payment_method_id: paymentMethodId,
  });
}
