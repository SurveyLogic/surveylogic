import {useMemo, useState} from 'react';
import {SortDescriptor} from '@common/ui/tables/types/sort-descriptor';
import {sortArrayOfObjects} from '@common/utils/array/sort-array-of-objects';
import {TableDataItem} from '@common/ui/tables/types/table-data-item';
import {TableProps} from '@common/ui/tables/table';

export function useSortableTableData<T extends TableDataItem>(
  data?: T[]
): {
  data: T[];
  sortDescriptor: TableProps<T>['sortDescriptor'];
  onSortChange: TableProps<T>['onSortChange'];
} {
  const [sortDescriptor, onSortChange] = useState<SortDescriptor>({});
  const sortedData: T[] = useMemo(() => {
    if (!data) {
      return [];
    } else if (sortDescriptor?.orderBy) {
      return sortArrayOfObjects(
        [...data],
        sortDescriptor.orderBy,
        sortDescriptor.orderDir
      );
    }
    return data;
  }, [sortDescriptor, data]);
  return {data: sortedData, sortDescriptor, onSortChange};
}
