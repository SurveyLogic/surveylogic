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

export const RoleIndexPageFilters: BackendFilter[] = [
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'type',
    label: message('Type'),
    description: message('Type of the role'),
    defaultValue: '01',
    defaultOperator: FilterOperator.ne,
    options: [
      {
        key: '01',
        label: message('Sitewide'),
        value: 'sitewide',
      },
      {
        key: '02',
        label: message('Workspace'),
        value: 'workspace',
      },
    ],
  }),
  new CreatedAtFilter({
    description: message('Date role was created'),
  }),
  new UpdatedAtFilter({
    description: message('Date role was last updated'),
  }),
];
