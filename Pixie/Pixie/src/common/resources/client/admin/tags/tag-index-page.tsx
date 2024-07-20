import React, {useContext, useMemo} from 'react';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import {Tag} from '../../tags/tag';
import {SiteConfigContext} from '../../core/settings/site-config-context';
import {TagIndexPageFilters} from './tag-index-page-filters';
import softwareEngineerSvg from './software-engineer.svg';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {CreateTagDialog} from './create-tag-dialog';
import {UpdateTagDialog} from './update-tag-dialog';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';

const columnConfig: ColumnConfig<Tag>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Name" />,
    body: tag => tag.name,
  },
  {
    key: 'type',
    allowsSorting: true,
    header: () => <Trans message="Type" />,
    body: tag => tag.type,
  },
  {
    key: 'display_name',
    allowsSorting: true,
    header: () => <Trans message="Display name" />,
    body: tag => tag.display_name,
  },
  {
    key: 'updated_at',
    allowsSorting: true,
    width: 'w-100',
    header: () => <Trans message="Last updated" />,
    body: tag => <FormattedDate date={tag.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-42 flex-shrink-0',
    visibleInMode: 'all',
    body: tag => {
      return (
        <DialogTrigger type="modal">
          <IconButton size="md" className="text-muted">
            <EditIcon />
          </IconButton>
          <UpdateTagDialog tag={tag} />
        </DialogTrigger>
      );
    },
  },
];

export function TagIndexPage() {
  const {tags} = useContext(SiteConfigContext);
  const filters = useMemo(() => {
    return TagIndexPageFilters(tags.types);
  }, [tags.types]);

  return (
    <DataTablePage
      endpoint="tags"
      title={<Trans message="Tags" />}
      columns={columnConfig}
      filters={filters}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={softwareEngineerSvg}
          title={<Trans message="No tags have been created yet" />}
          filteringTitle={<Trans message="No matching tags" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <>
      <DialogTrigger type="modal">
        <DataTableAddItemButton>
          <Trans message="Add new tag" />
        </DataTableAddItemButton>
        <CreateTagDialog />
      </DialogTrigger>
    </>
  );
}
