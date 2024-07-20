import {useEffect, useRef, useState} from 'react';
import {loadStripe, Stripe, StripeElements} from '@stripe/stripe-js';
import {apiClient} from '../../../http/query-client';
import {useSelectedLocale} from '../../../i18n/selected-locale';
import {useAuth} from '../../../auth/use-auth';
import {useIsDarkMode} from '../../../ui/themes/use-is-dark-mode';
import {useSettings} from '../../../core/settings/use-settings';

interface UseStripeProps {
  type: 'setupIntent' | 'subscription';
  productId?: string | number;
}
export function useStripe({type, productId}: UseStripeProps) {
  const {user} = useAuth();
  const isDarkMode = useIsDarkMode();
  const isInitiatedRef = useRef<boolean>(false);
  const paymentElementRef = useRef<HTMLDivElement>(null);
  const {localeCode} = useSelectedLocale();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const {
    branding: {site_name},
    billing: {
      stripe_public_key,
      stripe: {enable},
    },
  } = useSettings();

  useEffect(() => {
    if (!enable || !stripe_public_key || isInitiatedRef.current) return;

    Promise.all([
      // load stripe js library
      loadStripe(stripe_public_key, {
        apiVersion: '2022-08-01',
        locale: localeCode as any,
      }),
      // create partial subscription for clientSecret
      type === 'setupIntent'
        ? createSetupIntent()
        : createSubscription(productId!),
    ]).then(([stripe, {clientSecret}]) => {
      if (stripe && paymentElementRef.current) {
        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: isDarkMode ? 'night' : 'stripe',
          },
        });

        // Create and mount the Payment Element
        const paymentElement = elements.create('payment', {
          business: {name: site_name},
          terms: {card: 'never'},
          defaultValues: {
            billingDetails: {
              email: user?.email,
            },
          },
        });
        paymentElement.mount(paymentElementRef.current);

        setStripe(stripe);
        setElements(elements);
      }
    });

    isInitiatedRef.current = true;
  }, [
    productId,
    stripe_public_key,
    enable,
    isDarkMode,
    localeCode,
    site_name,
    type,
    user?.email,
  ]);

  return {
    stripe,
    elements,
    paymentElementRef,
    stripeIsEnabled: stripe_public_key != null && enable,
  };
}

function createSetupIntent(): Promise<{clientSecret: string}> {
  return apiClient.post('billing/stripe/create-setup-intent').then(r => r.data);
}

function createSubscription(
  productId: number | string
): Promise<{clientSecret: string}> {
  return apiClient
    .post('billing/stripe/create-partial-subscription', {product_id: productId})
    .then(r => r.data);
}
