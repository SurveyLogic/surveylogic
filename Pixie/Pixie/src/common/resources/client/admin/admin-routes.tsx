import {Navigate, RouteObject, useRoutes} from 'react-router-dom';
import {AdminLayout} from './admin-layout';
import {UserIndex} from './users/user-index';
import {AppearanceLayout} from './appearance/appearance-layout';
import {MenuList} from './appearance/sections/menus/menu-list';
import {MenuEditor} from './appearance/sections/menus/menu-editor';
import {MenuItemEditor} from './appearance/sections/menus/menu-item-editor';
import {GeneralSection} from './appearance/sections/general-section';
import {ThemeList} from './appearance/sections/themes/theme-list';
import {SeoSection} from './appearance/sections/seo-section';
import {CustomCodeSection} from './appearance/sections/code/custom-code-section';
import {CustomPageDatablePage} from './custom-pages/custom-page-datable-page';
import {PageEditorLayout} from './custom-pages/editor/page-editor-layout';
import {SettingsLayout} from './settings/settings-layout';
import {GeneralSettings} from './settings/pages/general-settings';
import {ThemeEditor} from './appearance/sections/themes/theme-editor';
import {AppSettingsRoutes} from '@app/admin/settings/app-settings-routes';
import {SubscriptionSettings} from './settings/pages/subscription-settings';
import {LocalizationSettings} from './settings/pages/localization-settings';
import {AuthenticationSettings} from './settings/pages/authentication-settings';
import {UploadingSettings} from './settings/pages/uploading-settings/uploading-settings';
import {MailSettings} from './settings/pages/mail-settings/mail-settings';
import {CacheSettings} from './settings/pages/cache-settings/cache-settings';
import {LoggingSettings} from './settings/pages/logging-settings';
import {QueueSettings} from './settings/pages/queue-settings';
import {RecaptchaSettings} from './settings/pages/recaptcha-settings';
import {ReportsSettings} from './settings/pages/reports-settings';
import {UpdateUserPage} from './users/update-user-page';
import {CreateUserPage} from './users/create-user-page';
import {LocalizationIndex} from './translations/localization-index';
import {TranslationManagementPage} from './translations/translation-management-page';
import {AdsPage} from './ads/ads-page';
import React from 'react';
import {FullPageLoader} from '../ui/progress/full-page-loader';
import {SectionList} from './appearance/section-list';
import {RolesIndexPage} from './roles/roles-index-page';
import {EditRolePage} from './roles/crupdate-role-page/edit-role-page';
import {CreateRolePage} from './roles/crupdate-role-page/create-role-page';
import {TagIndexPage} from './tags/tag-index-page';
import {FileEntryIndexPage} from './file-entry/file-entry-index-page';
import {SubscriptionsIndexPage} from './subscriptions/subscriptions-index-page';
import {PlansIndexPage} from './plans/plans-index-page';
import {EditPlanPage} from './plans/crupdate-plan-page/edit-plan-page';
import {CreatePlanPage} from './plans/crupdate-plan-page/create-plan-page';
import {GdprSettings} from './settings/pages/gdpr-settings';
import {AuthRoute} from '../auth/guards/auth-route';
import {NotFoundPage} from '../ui/not-found-page/not-found-page';
import {AppAppearanceConfig} from '@app/admin/appearance/app-appearance-config';
import {AppAdminRoutes} from '@app/admin/app-admin-routes';

const ReportsPage = React.lazy(() => import('./analytics/admin-report-page'));

const AdminRouteConfig: RouteObject[] = [
  {
    path: 'appearance',
    element: (
      <AuthRoute permission="appearance.update">
        <AppearanceLayout />
      </AuthRoute>
    ),
    children: [
      {index: true, element: <SectionList />},
      {path: 'general', element: <GeneralSection />},
      {path: 'seo-settings', element: <SeoSection />},
      {path: 'custom-code', element: <CustomCodeSection />},
      {path: 'themes', element: <ThemeList />},
      {path: 'themes/:themeIndex', element: <ThemeEditor />},
      {path: 'menus', element: <MenuList />},
      {path: 'menus/:menuIndex', element: <MenuEditor />},
      {
        path: 'menus/:menuIndex/items/:menuItemIndex',
        element: <MenuItemEditor />,
      },
      ...Object.values(AppAppearanceConfig.sections).flatMap(
        s => s.routes || []
      ),
    ],
  },

  {
    path: '/',
    element: <AdminLayout />,
    children: [
      ...AppAdminRoutes,
      // REPORT PAGE
      {
        path: '/',
        element: (
          <React.Suspense fallback={<FullPageLoader />}>
            <ReportsPage />
          </React.Suspense>
        ),
      },
      // USERS
      {
        path: 'users',
        element: (
          <AuthRoute permission="users.update">
            <UserIndex />
          </AuthRoute>
        ),
      },
      {
        path: 'users/new',
        element: (
          <AuthRoute permission="users.update">
            <CreateUserPage />
          </AuthRoute>
        ),
      },
      {
        path: 'users/:userId/edit',
        element: (
          <AuthRoute permission="users.update">
            <UpdateUserPage />
          </AuthRoute>
        ),
      },
      // ROLES
      {
        path: 'roles',
        element: (
          <AuthRoute permission="roles.update">
            <RolesIndexPage />
          </AuthRoute>
        ),
      },
      {
        path: 'roles/new',
        element: (
          <AuthRoute permission="roles.update">
            <CreateRolePage />
          </AuthRoute>
        ),
      },
      {
        path: 'roles/:roleId/edit',
        element: (
          <AuthRoute permission="roles.update">
            <EditRolePage />
          </AuthRoute>
        ),
      },
      // SUBSCRIPTIONS and PLANS
      {
        path: 'subscriptions',
        element: (
          <AuthRoute permission="subscriptions.update">
            <SubscriptionsIndexPage />
          </AuthRoute>
        ),
      },
      {
        path: 'plans',
        element: (
          <AuthRoute permission="plans.update">
            <PlansIndexPage />
          </AuthRoute>
        ),
      },
      {
        path: 'plans/new',
        element: (
          <AuthRoute permission="plans.update">
            <CreatePlanPage />
          </AuthRoute>
        ),
      },
      {
        path: 'plans/:productId/edit',
        element: (
          <AuthRoute permission="plans.update">
            <EditPlanPage />
          </AuthRoute>
        ),
      },
      // CUSTOM PAGES
      {
        path: 'custom-pages',
        element: (
          <AuthRoute permission="custom_pages.update">
            <CustomPageDatablePage />
          </AuthRoute>
        ),
      },
      {
        path: 'custom-pages/new',
        element: (
          <AuthRoute permission="custom_pages.update">
            <PageEditorLayout />
          </AuthRoute>
        ),
      },
      {
        path: 'custom-pages/:pageId/edit',
        element: (
          <AuthRoute permission="custom_pages.update">
            <PageEditorLayout />
          </AuthRoute>
        ),
      },
      // TAGS
      {
        path: 'tags',
        element: (
          <AuthRoute permission="tags.update">
            <TagIndexPage />
          </AuthRoute>
        ),
      },
      // LOCALIZATIONS
      {
        path: 'localizations',
        element: (
          <AuthRoute permission="localizations.update">
            <LocalizationIndex />
          </AuthRoute>
        ),
      },
      {
        path: 'localizations/:localeId/translate',
        element: <TranslationManagementPage />,
      },
      // FILE ENTRIES
      {
        path: 'files',
        element: (
          <AuthRoute permission="files.update">
            <FileEntryIndexPage />
          </AuthRoute>
        ),
      },
      // ADS
      {
        path: 'ads',
        element: (
          <AuthRoute permission="settings.update">
            <AdsPage />
          </AuthRoute>
        ),
      },
      // SETTINGS
      {
        path: 'settings',
        element: (
          <AuthRoute permission="settings.update">
            <SettingsLayout />
          </AuthRoute>
        ),
        children: [
          {index: true, element: <Navigate to="general" replace />},
          {path: 'general', element: <GeneralSettings />},
          {path: 'subscriptions', element: <SubscriptionSettings />},
          {path: 'localization', element: <LocalizationSettings />},
          {path: 'authentication', element: <AuthenticationSettings />},
          {path: 'uploading', element: <UploadingSettings />},
          {path: 'mail', element: <MailSettings />},
          {path: 'cache', element: <CacheSettings />},
          {path: 'analytics', element: <ReportsSettings />},
          {path: 'logging', element: <LoggingSettings />},
          {path: 'queue', element: <QueueSettings />},
          {path: 'recaptcha', element: <RecaptchaSettings />},
          {path: 'gdpr', element: <GdprSettings />},
          ...AppSettingsRoutes,
        ],
      },
    ],
  },
  {path: '*', element: <NotFoundPage />},
];

export default function AdminRoutes() {
  return useRoutes(AdminRouteConfig);
}
