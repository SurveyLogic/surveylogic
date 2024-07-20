import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import {AuthRoute} from '../auth/guards/auth-route';
import {NotificationsPage} from './notifications-page';
import {NotificationSettingsPage} from './subscriptions/notification-settings-page';
import {ActiveWorkspaceProvider} from '../workspace/active-workspace-id-context';

export const NotificationRoutes = (
  <Fragment>
    <Route
      path="/notifications"
      element={
        <AuthRoute>
          <ActiveWorkspaceProvider>
            <NotificationsPage />
          </ActiveWorkspaceProvider>
        </AuthRoute>
      }
    />
    <Route
      path="/notifications/settings"
      element={
        <AuthRoute>
          <NotificationSettingsPage />
        </AuthRoute>
      }
    />
  </Fragment>
);
