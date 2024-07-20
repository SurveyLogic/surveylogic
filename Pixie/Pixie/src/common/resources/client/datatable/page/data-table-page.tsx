import React, {ReactElement, ReactNode, useId} from 'react';
import {TableDataItem} from '../../ui/tables/types/table-data-item';
import {DataTable, DataTableProps} from '../data-table';
import {TableProps} from '../../ui/tables/table';
import {StaticPageTitle} from '../../seo/static-page-title';
import {MessageDescriptor} from '../../i18n/message-descriptor';
import clsx from 'clsx';

interface Props<T extends TableDataItem> extends DataTableProps<T> {
  title?: ReactElement<MessageDescriptor>;
  headerContent?: ReactNode;
  headerItemsAlign?: string;
  enableSelection?: boolean;
  onRowAction?: TableProps<T>['onAction'];
}
export function DataTablePage<T extends TableDataItem>({
  title,
  headerContent,
  headerItemsAlign = 'items-end',
  ...dataTableProps
}: Props<T>) {
  const titleId = useId();

  return (
    <div className="p-12 md:p-24">
      {title && (
        <div
          className={clsx(
            'mb-16',
            headerContent && `flex ${headerItemsAlign} gap-4`
          )}
        >
          <StaticPageTitle>{title}</StaticPageTitle>
          <h1 className="text-3xl font-light" id={titleId}>
            {title}
          </h1>
          {headerContent}
        </div>
      )}

      <DataTable
        {...dataTableProps}
        tableDomProps={{
          'aria-labelledby': title ? titleId : undefined,
        }}
      />
    </div>
  );
}
