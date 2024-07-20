import {HeaderCell} from '@common/ui/tables/header-cell';
import React, {useContext} from 'react';
import {TableContext} from '@common/ui/tables/table-context';

export function TableHeaderRow() {
  const {columns} = useContext(TableContext);
  return (
    <div
      role="row"
      aria-rowindex={1}
      tabIndex={-1}
      className="flex gap-x-16 px-16"
    >
      {columns.map((column, columnIndex) => (
        <HeaderCell index={columnIndex} key={column.key} />
      ))}
    </div>
  );
}
