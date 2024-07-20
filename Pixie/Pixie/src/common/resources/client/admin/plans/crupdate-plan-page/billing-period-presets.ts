import {message} from '../../../i18n/message';

export const BillingPeriodPresets = [
  {
    key: 'day1',
    label: message('Daily'),
    interval: 'day',
    interval_count: 1,
  },
  {
    key: 'week1',
    label: message('Weekly'),
    interval: 'week',
    interval_count: 1,
  },
  {
    key: 'month1',
    label: message('Monthly'),
    interval: 'month',
    interval_count: 1,
  },
  {
    key: 'month3',
    label: message('Every 3 months'),
    interval: 'month',
    interval_count: 3,
  },
  {
    key: 'month6',
    label: message('Every 6 months'),
    interval: 'month',
    interval_count: 6,
  },
  {
    key: 'year1',
    label: message('Yearly'),
    interval: 'year',
    interval_count: 1,
  },
  {
    key: 'custom',
    label: message('Custom'),
    interval: null,
    interval_count: null,
  },
];
