import {RegisterPage} from './ui/register-page';
import {AuthRoute} from './guards/auth-route';
import {AccountSettingsPage} from './ui/account-settings/account-settings-page';
import {GuestRoute} from './guards/guest-route';
import {ForgotPasswordPage} from './ui/forgot-password-page';
import {ResetPasswordPage} from './ui/reset-password-page';
import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import {LoginPageWrapper} from '@common/auth/ui/login-page-wrapper';

export const AuthRoutes = (
  <Fragment>
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/account-settings"
      element={
        <AuthRoute>
          <AccountSettingsPage />
        </AuthRoute>
      }
    />
    <Route
      path="login"
      element={
        <GuestRoute>
          <LoginPageWrapper />
        </GuestRoute>
      }
    />
    <Route
      path="/workspace/join/register"
      element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      }
    />
    <Route
      path="/workspace/join/login"
      element={
        <GuestRoute>
          <LoginPageWrapper />
        </GuestRoute>
      }
    />
    <Route
      path="forgot-password"
      element={
        <GuestRoute>
          <ForgotPasswordPage />
        </GuestRoute>
      }
    />
    <Route
      path="/password/reset/:token"
      element={
        <GuestRoute>
          <ResetPasswordPage />
        </GuestRoute>
      }
    />
  </Fragment>
);
