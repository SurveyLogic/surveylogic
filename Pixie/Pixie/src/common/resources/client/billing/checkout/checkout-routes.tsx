import {Route, Routes} from 'react-router-dom';
import {NotSubscribedRoute} from '../../auth/guards/not-subscribed-route';
import {Checkout} from './checkout';
import React from 'react';
import {CheckoutStripeDone} from './stripe/checkout-stripe-done';
import {CheckoutPaypalDone} from './paypal/checkout-paypal-done';

export default function CheckoutRoutes() {
  return (
    <Routes>
      <Route
        path=":productId/:priceId"
        element={
          <NotSubscribedRoute>
            <Checkout />
          </NotSubscribedRoute>
        }
      />
      <Route
        path=":productId/:priceId/stripe/done"
        element={
          <NotSubscribedRoute>
            <CheckoutStripeDone />
          </NotSubscribedRoute>
        }
      />
      <Route
        path=":productId/:priceId/paypal/done"
        element={
          <NotSubscribedRoute>
            <CheckoutPaypalDone />
          </NotSubscribedRoute>
        }
      />
    </Routes>
  );
}
