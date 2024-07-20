import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {Role} from '../../auth/role';
import teamSvg from './team.svg';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import {RoleIndexPageFilters} from './role-index-page-filters';
import {DataTableExportCsvButton} from '../../datatable/csv-export/data-table-export-csv-button';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';

const columnConfig: ColumnConfig<Role>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    header: () => <Trans message="Role" />,
    body: role => (
      <div>
        <div>
          <Trans message={role.name} />
        </div>
        <div className="text-muted text-xs overflow-x-hidden overflow-ellipsis">
          {role.description ? <Trans message={role.description} /> : undefined}
        </div>
      </div>
    ),
  },
  {
    key: 'type',
    maxWidth: 'max-w-100',
    allowsSorting: true,
    header: () => <Trans message="Type" />,
    body: role => <Trans message={role.type} />,
  },
  {
    key: 'updated_at',
    maxWidth: 'max-w-100',
    allowsSorting: true,
    header: () => <Trans message="Last updated" />,
    body: role => <FormattedDate date={role.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    visibleInMode: 'all',
    align: 'end',
    width: 'w-42 flex-shrink-0',
    body: role => {
      return (
        <Link to={`${role.id}/edit`}>
          <IconButton size="md" className="text-muted">
            <EditIcon />
          </IconButton>
        </Link>
      );
    },
  },
];

export function RolesIndexPage() {
  return (
    <DataTablePage
      endpoint="roles"
      title={<Trans message="Roles" />}
      columns={columnConfig}
      filters={RoleIndexPageFilters}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={teamSvg}
          title={<Trans message="No roles have been created yet" />}
          filteringTitle={<Trans message="No matching roles" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <Fragment>
      <DataTableExportCsvButton endpoint="roles/csv/export" />
      <DataTableAddItemButton elementType={Link} to="new">
        <Trans message="Add new role" />
      </DataTableAddItemButton>
    </Fragment>
  );
}
