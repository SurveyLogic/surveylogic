import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from './backend-response/backend-response';
import {Localization} from '../i18n/localization';
import {CssTheme} from '../ui/themes/css-theme';
import {Role} from '../auth/role';
import {Permission} from '../auth/permission';
import {apiClient, queryClient} from './query-client';
import {MenuItemCategory} from '../admin/appearance/sections/menus/menu-item-category';
import {CustomPage} from '../admin/custom-pages/custom-page';
import {CustomDomain} from '../custom-domains/custom-domain';
import {MessageDescriptor} from '@common/i18n/message-descriptor';

export interface FetchValueListsResponse extends BackendResponse {
  countries?: CountryListItem[];
  timezones?: {[key: string]: Timezone[]};
  languages?: LanguageListItem[];
  localizations?: Localization[];
  currencies?: {[key: string]: Currency};
  domains?: CustomDomain[];
  pages?: CustomPage[];
  themes?: CssTheme[];
  permissions?: Permission[];
  workspacePermissions?: Permission[];
  roles?: Role[];
  menuItemCategories?: MenuItemCategory[];
  googleFonts?: FontConfig[];
  workspaceRoles?: Role[];
}

export interface CountryListItem {
  name: string;
  code: string;
}

export interface LanguageListItem {
  name: string;
  nativeName?: string;
  code: string;
}

export interface Currency {
  name: string;
  decimal_digits: number;
  symbol: string;
  code: string;
}

export interface Timezone {
  text: string;
  value: string;
}

export interface FontConfig {
  label?: MessageDescriptor;
  family: string;
  category?: string;
  google?: boolean;
}

export function useValueLists(
  names: (keyof FetchValueListsResponse)[],
  params?: Record<string, string | number | undefined>
) {
  return useQuery(
    ['ValueLists', names, params],
    () => fetchValueLists(names, params),
    {
      staleTime: Infinity,
      initialData: () => {
        // check if we have already fetched value lists for all specified names previously,
        // if so, return cached response for this query, as there's no need to fetch it again
        const previousData = queryClient
          .getQueriesData<FetchValueListsResponse>(['ValueLists'])
          .find(([, response]) => {
            if (response && names.every(n => response[n])) {
              return response;
            }
            return null;
          });
        if (previousData) {
          return previousData[1];
        }
      },
    }
  );
}

export function prefetchValueLists(
  names: (keyof FetchValueListsResponse)[],
  params?: Record<string, string | number | undefined>
) {
  queryClient.prefetchQuery(['ValueLists', names, params], () =>
    fetchValueLists(names, params)
  );
}

function fetchValueLists(
  names: (keyof FetchValueListsResponse)[],
  params?: Record<string, string | number | undefined>
): Promise<FetchValueListsResponse> {
  return apiClient
    .get(`value-lists/${names}`, params)
    .then(response => response.data);
}
