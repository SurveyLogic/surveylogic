import {Key} from 'react';
import {BackendFilter} from '../backend-filter';

export interface FilterListValue {
  key: Key;
  value: BackendFilter['defaultValue'];
  operator?: BackendFilter['defaultOperator'];
  valueKey?: Key;
  isInactive?: boolean;
}

export function encodeBackendFilters(
  filterValue: FilterListValue[] | null,
  filters?: BackendFilter[]
): string {
  if (!filterValue) return '';

  // prepare values for backend
  filterValue = !filters
    ? filterValue
    : filterValue
        .filter(item => item.value !== '')
        .map(item => {
          return transformValue(item, filters);
        });

  // remove all placeholder filters
  filterValue = filterValue.filter(fm => !fm.isInactive);

  if (!filterValue.length) {
    return '';
  }

  return encodeURIComponent(btoa(JSON.stringify(filterValue)));
}

function transformValue(
  filterValue: FilterListValue,
  filters: BackendFilter[]
) {
  const filterConfig = filters.find(f => f.key === filterValue.key);
  // select components will use a key always, as we can't use objects as
  // value, map over select options and replace key with actual value
  if (filterConfig?.type === 'select') {
    const option = (filterConfig.options || []).find(
      o => o.key === filterValue.value
    );
    return {...filterValue, value: option?.value, valueKey: option?.key};
  }
  return filterValue;
}
