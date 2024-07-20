import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '../../datatable/filters/backend-filter';
import {message} from '../../i18n/message';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '../../datatable/filters/timestamp-filters';

export const PlansIndexPageFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'subscriptions',
    label: message('Subscriptions'),
    description: message('Whether plan has any active subscriptions'),
    defaultValue: '01',
    options: [
      {
        key: '01',
        label: message('Has active subscriptions'),
        value: {value: '*', operator: FilterOperator.has},
      },
      {
        key: '02',
        label: message('Does not have active subscriptions'),
        value: {value: '*', operator: FilterOperator.doesntHave},
      },
    ],
  }),
  new CreatedAtFilter({
    description: message('Date plan was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date plan was last updated'),
  }),
];
