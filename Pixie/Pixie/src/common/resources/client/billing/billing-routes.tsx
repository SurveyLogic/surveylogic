import {Route} from 'react-router-dom';
import {PricingPage} from './pricing-table/pricing-page';
import React, {Fragment} from 'react';
import {FullPageLoader} from '../ui/progress/full-page-loader';

const BillingPageRoutes = React.lazy(
  () => import('./billing-page/billing-page-routes')
);

const CheckoutRoutes = React.lazy(() => import('./checkout/checkout-routes'));

export const BillingRoutes = (
  <Fragment>
    <Route path="/pricing" element={<PricingPage />} />
    <Route
      path="checkout/*"
      element={
        <React.Suspense fallback={<FullPageLoader />}>
          <CheckoutRoutes />
        </React.Suspense>
      }
    />
    <Route
      path="billing/*"
      element={
        <React.Suspense fallback={<FullPageLoader />}>
          <BillingPageRoutes />
        </React.Suspense>
      }
    />
  </Fragment>
);
