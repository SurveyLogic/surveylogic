import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '../../datatable/filters/backend-filter';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '../../datatable/filters/timestamp-filters';
import {message} from '../../i18n/message';

export const UserIndexFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'email_verified_at',
    label: message('Email'),
    description: message('Email verification status'),
    defaultValue: '01',
    defaultOperator: FilterOperator.ne,
    options: [
      {
        key: '01',
        label: message('is confirmed'),
        value: {value: null, operator: FilterOperator.ne},
      },
      {
        key: '02',
        label: message('is not confirmed'),
        value: {value: null, operator: FilterOperator.eq},
      },
    ],
  }),
  new CreatedAtFilter({
    description: message('Date user registered or was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date user was last updated'),
  }),
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'subscriptions',
    label: message('Subscription'),
    description: message('Whether user is subscribed or not'),
    defaultValue: '01',
    options: [
      {
        key: '01',
        label: message('is subscribed'),
        value: {value: '*', operator: FilterOperator.has},
      },
      {
        key: '02',
        label: message('is not subscribed'),
        value: {value: '*', operator: FilterOperator.doesntHave},
      },
    ],
  }),
];
