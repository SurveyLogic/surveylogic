import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '../../datatable/filters/backend-filter';
import {message} from '../../i18n/message';
import {
  CreatedAtFilter,
  TimestampFilter,
  UpdatedAtFilter,
} from '../../datatable/filters/timestamp-filters';

export const SubscriptionIndexPageFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'ends_at',
    label: message('Status'),
    description: message('Whether subscription is active or cancelled'),
    defaultValue: 'active',
    options: [
      {
        key: 'active',
        label: message('Active'),
        value: {value: null, operator: FilterOperator.eq},
      },
      {
        key: 'cancelled',
        label: message('Cancelled'),
        value: {value: null, operator: FilterOperator.ne},
      },
    ],
  }),
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'gateway_name',
    label: message('Gateway'),
    description: message(
      'With which payment provider was subscription created'
    ),
    defaultValue: 'stripe',
    options: [
      {
        key: 'stripe',
        label: message('Stripe'),
        value: 'stripe',
      },
      {
        key: 'paypal',
        label: message('PayPal'),
        value: 'paypal',
      },
      {
        key: 'none',
        label: message('None'),
        value: 'none',
      },
    ],
  }),
  new TimestampFilter({
    key: 'renews_at',
    label: message('Renew date'),
    description: message('Date subscription will renew'),
  }),
  new CreatedAtFilter({
    description: message('Date subscription was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date subscription was last updated'),
  }),
];
