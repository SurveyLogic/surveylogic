import {
  BackendFilter,
  FilterControlType,
} from '../../datatable/filters/backend-filter';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '../../datatable/filters/timestamp-filters';
import {message} from '../../i18n/message';
import {USER_MODEL} from '../../auth/user';
import {SiteConfigContextValue} from '@common/core/settings/site-config-context';

export const CustomPageDatatableFilters = (
  config: SiteConfigContextValue
): BackendFilter[] => {
  const dynamicFilters =
    config.customPages.types.length > 1
      ? [
          new BackendFilter({
            type: FilterControlType.Select,
            key: 'type',
            label: message('Type'),
            description: message('Type of the page'),
            defaultValue: 'default',
            options: config.customPages.types.map(type => {
              return {value: type.type, label: type.label, key: type.type};
            }),
          }),
        ]
      : [];

  return [
    new BackendFilter({
      type: FilterControlType.SelectModel,
      model: USER_MODEL,
      key: 'user_id',
      label: message('User'),
      description: message('User page was created by'),
    }),
    ...dynamicFilters,
    new CreatedAtFilter({
      description: message('Date page was created'),
    }),
    new UpdatedAtFilter({
      description: message('Date page was last updated'),
    }),
  ];
};
