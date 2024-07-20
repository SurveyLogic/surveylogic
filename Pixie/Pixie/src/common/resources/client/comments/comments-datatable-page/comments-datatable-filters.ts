import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '@common/datatable/filters/backend-filter';
import {message} from '@common/i18n/message';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '@common/datatable/filters/timestamp-filters';
import {USER_MODEL} from '@common/auth/user';

export const CommentsDatatableFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'deleted',
    label: message('Status'),
    description: message('Whether comment is active or deleted'),
    defaultValue: '01',
    defaultOperator: FilterOperator.eq,
    options: [
      {
        key: '01',
        label: message('Active'),
        value: false,
      },
      {
        key: '02',
        label: message('Deleted'),
        value: true,
      },
    ],
  }),
  new BackendFilter({
    type: FilterControlType.SelectModel,
    model: USER_MODEL,
    key: 'user_id',
    label: message('User'),
    description: message('User comment was created by'),
  }),
  new CreatedAtFilter({
    description: message('Date comment was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date comment was last updated'),
  }),
];
