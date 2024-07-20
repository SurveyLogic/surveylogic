import {FilterListValue} from './encode-backend-filters';

export function decodeBackendFilters(
  encodedFilters: string | null
): FilterListValue[] {
  if (!encodedFilters) return [];
  let filtersFromQuery: FilterListValue[] = [];
  try {
    filtersFromQuery = JSON.parse(atob(decodeURIComponent(encodedFilters)));
    filtersFromQuery.map(filterValue => {
      // set value key as value so selects work properly
      if (filterValue.valueKey != null) {
        filterValue.value = filterValue.valueKey;
      }
      return filterValue;
    });
  } catch (e) {
    //
  }
  return filtersFromQuery;
}
