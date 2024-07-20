import clsx from 'clsx';
import {BackendFilter} from '../backend-filter';
import {useBackendFilterUrlParams} from '../backend-filter-url-params';
import {IconButton} from '../../../ui/buttons/icon-button';
import {CloseIcon} from '../../../icons/material/Close';
import {FilterListControl} from './filter-list-control';
import {FilterItemFormValue} from '../add-filter-dialog';

interface FilterListProps {
  filters: BackendFilter[];
  // these filters will always be shown, even if value is not yet selected for filter
  pinnedFilters?: string[];
  className?: string;
}
export function FilterList({
  filters,
  pinnedFilters,
  className,
}: FilterListProps) {
  const {decodedFilters, remove, replaceAll} = useBackendFilterUrlParams(
    filters,
    pinnedFilters
  );

  if (!decodedFilters.length) return null;

  return (
    <div className={clsx('flex items-center gap-6 overflow-x-auto', className)}>
      {decodedFilters.map((field, index) => {
        const filter = filters.find(f => f.key === field.key)!;

        const handleValueChange = (payload: FilterItemFormValue) => {
          const newFilters = [...decodedFilters];
          newFilters.splice(index, 1, {
            key: filter.key,
            value: payload.value,
            isInactive: false,
            operator: payload.operator || filter.defaultOperator,
          });
          replaceAll(newFilters);
        };

        return (
          <div key={field.key}>
            {!field.isInactive && (
              <IconButton
                variant="outline"
                color="primary"
                size="xs"
                radius="rounded-l-md"
                onClick={() => {
                  remove(field.key);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
            <FilterListControl
              filter={filter}
              isInactive={field.isInactive}
              value={field.valueKey != null ? field.valueKey : field.value}
              operator={field.operator}
              onValueChange={handleValueChange}
            />
          </div>
        );
      })}
    </div>
  );
}
