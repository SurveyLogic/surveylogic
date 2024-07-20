import {
  IAppearanceConfig,
  MenuSectionConfig,
} from '../types/appearance-editor-config';
import {message} from '../../../i18n/message';
import {chunkArray} from '../../../utils/array/chunk-array';
import {AppearanceEditorBreadcrumbItem} from '../types/appearance-editor-section';

export const DefaultAppearanceConfig: IAppearanceConfig = {
  preview: {
    defaultRoute: '/',
    navigationRoutes: [],
  },
  sections: {
    general: {
      label: message('General'),
      position: 1,
      buildBreadcrumb: () => [
        {
          label: message('General'),
          location: `general`,
        },
      ],
    },
    themes: {
      label: message('Themes'),
      position: 2,
      buildBreadcrumb: (pathname, formValue) => {
        const parts = pathname.split('/').filter(p => !!p);
        const [, , , themeIndex] = parts;
        const breadcrumb: AppearanceEditorBreadcrumbItem[] = [
          {
            label: message('Themes'),
            location: `themes`,
          },
        ];
        if (themeIndex != null) {
          breadcrumb.push({
            label: formValue.appearance.themes.all[+themeIndex]?.name,
            location: `themes/${themeIndex}`,
          });
        }
        return breadcrumb;
      },
    },
    menus: {
      label: message('Menus'),
      position: 3,
      buildBreadcrumb: (pathname, formValue) => {
        // /admin/appearance/menus/0/items/1
        const parts = pathname.split('/').filter(p => !!p);
        const [, , ...rest] = parts;
        // admin/appearance
        const breadcrumb: AppearanceEditorBreadcrumbItem[] = [
          {
            label: message('Menus'),
            location: 'menus',
          },
        ];
        // chunk every two items: [form group, item index]
        const chunked = chunkArray(rest, 2);
        chunked.forEach(([sectionName, sectionIndex], chunkIndex) => {
          // menu
          if (sectionName === 'menus' && sectionIndex != null) {
            breadcrumb.push({
              label: formValue.settings.menus[+sectionIndex]?.name,
              location: `menus/${sectionIndex}`,
            });
            // menu item
          } else if (sectionName === 'items' && sectionIndex != null) {
            const [, menuIndex] = chunked[chunkIndex - 1];
            breadcrumb.push({
              label:
                formValue.settings.menus[+menuIndex].items[+sectionIndex]
                  ?.label,
              location: `menus/${menuIndex}/${sectionIndex}`,
            });
          }
        });
        return breadcrumb;
      },
      config: {
        availableRoutes: [
          '/login',
          '/register',
          '/contact',
          '/billing/pricing',
          '/account-settings',
          '/admin',
          '/admin/appearance',
          '/admin/settings',
          '/admin/plans',
          '/admin/subscriptions',
          '/admin/users',
          '/admin/roles',
          '/admin/pages',
          '/admin/tags',
          '/admin/files',
          '/admin/localizations',
          '/admin/ads',
          '/admin/settings/authentication',
          '/admin/settings/branding',
          '/admin/settings/cache',
          '/admin/settings/providers',
          '/api-routes',
        ],
        positions: [
          'admin-navbar',
          'admin-sidebar',
          'custom-page-navbar',
          'auth-page-footer',
          'auth-dropdown',
          'account-settings-page',
          'billing-page',
          'checkout-page-navbar',
          'checkout-page-footer',
          'pricing-table-page',
          'contact-us-page',
          'notifications-page',
          'footer',
          'footer-secondary',
        ],
      } as MenuSectionConfig,
    },
    'custom-code': {
      label: message('Custom Code'),
      position: 4,
      buildBreadcrumb: () => [
        {
          label: message('Custom code'),
          location: `custom-code`,
        },
      ],
    },
    'seo-settings': {
      label: message('SEO Settings'),
      position: 5,
      buildBreadcrumb: () => [
        {
          label: message('SEO'),
          location: `seo`,
        },
      ],
    },
  },
};
