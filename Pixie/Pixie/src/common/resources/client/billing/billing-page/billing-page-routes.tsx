import {Route, Routes} from 'react-router-dom';
import React from 'react';
import {SubscribedRoute} from '../../auth/guards/subscribed-route';
import {BillingPageLayout} from './billing-page-layout';
import {ChangePaymentMethodLayout} from './change-payment-method/change-payment-method-layout';
import {ChangePaymentMethodPage} from './change-payment-method/change-payment-method-page';
import {ChangePaymentMethodDone} from './change-payment-method/change-payment-method-done';
import {ChangePlanPage} from './change-plan-page';
import {ConfirmPlanChangePage} from './confirm-plan-change-page';
import {ConfirmPlanCancellationPage} from './confirm-plan-cancellation-page';
import {ConfirmPlanRenewalPage} from './confirm-plan-renewal-page';
import {BillingPage} from './billing-page';

export default function BillingPageRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SubscribedRoute>
            <BillingPageLayout />
          </SubscribedRoute>
        }
      >
        <Route index element={<BillingPage />} />
        <Route
          path="change-payment-method"
          element={<ChangePaymentMethodLayout />}
        >
          <Route index element={<ChangePaymentMethodPage />} />
          <Route path="done" element={<ChangePaymentMethodDone />} />
        </Route>
        <Route path="change-plan" element={<ChangePlanPage />} />
        <Route
          path="change-plan/:productId/:priceId/confirm"
          element={<ConfirmPlanChangePage />}
        />
        <Route path="cancel" element={<ConfirmPlanCancellationPage />} />
        <Route path="renew" element={<ConfirmPlanRenewalPage />} />
      </Route>
    </Routes>
  );
}
