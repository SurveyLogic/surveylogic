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
import {TagType} from '../../core/settings/site-config-context';

export const TagIndexPageFilters = (types: TagType[]): BackendFilter[] => {
  return [
    new BackendFilter({
      type: FilterControlType.Select,
      key: 'type',
      label: message('Type'),
      description: message('Type of the tag'),
      defaultValue: types[0].name,
      defaultOperator: FilterOperator.ne,
      options: types.map(type => {
        return {
          key: type.name,
          label: message(type.name),
          value: type.name,
        };
      }),
    }),
    new CreatedAtFilter({
      description: message('Date tag was created'),
    }),
    new UpdatedAtFilter({
      description: message('Date tag was last updated'),
    }),
  ];
};
