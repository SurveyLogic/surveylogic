import {
  BackendFilter,
  FilterControlType,
} from '@common/datatable/filters/backend-filter';
import {message} from '@common/i18n/message';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '@common/datatable/filters/timestamp-filters';
import {USER_MODEL} from '@common/auth/user';

export const DomainsDatatableFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.BooleanToggle,
    key: 'global',
    defaultValue: true,
    label: message('Global'),
    description: message('Whether domain is marked as global'),
  }),
  new CreatedAtFilter({
    description: message('Date domain was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date domain was last updated'),
  }),
  new BackendFilter({
    type: FilterControlType.SelectModel,
    model: USER_MODEL,
    key: 'user_id',
    label: message('Owner'),
    description: message('User domain belongs to'),
  }),
];
