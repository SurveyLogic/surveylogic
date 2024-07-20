import {useContext, useMemo} from 'react';
import {TableContext} from './table-context';
import {TableDataItem} from './types/table-data-item';
import {RowContext} from '@common/datatable/column-config';
import {useTableCellStyle} from '@common/ui/tables/style/use-table-cell-style';

interface TableCellProps {
  rowIsHovered: boolean;
  rowIndex: number;
  index: number;
  item: TableDataItem;
  id?: string;
}
export function TableCell({
  rowIndex,
  rowIsHovered,
  index,
  item,
  id,
}: TableCellProps) {
  const {columns} = useContext(TableContext);
  const column = columns[index];

  const rowContext: RowContext = useMemo(() => {
    return {
      index: rowIndex,
      isHovered: rowIsHovered,
      isPlaceholder: item.isPlaceholder,
    };
  }, [rowIndex, rowIsHovered, item.isPlaceholder]);

  const style = useTableCellStyle({
    index: index,
  });

  return (
    <div
      tabIndex={-1}
      role="gridcell"
      aria-colindex={index + 1}
      id={id}
      className={style}
    >
      <div className="overflow-x-hidden overflow-ellipsis min-w-0 w-full">
        {column.body(item, rowContext)}
      </div>
    </div>
  );
}
