import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import {CheckIcon} from '../../icons/material/Check';
import {UserIndexFilters} from './user-index-filters';
import {User} from '../../auth/user';
import {NameWithAvatar} from '../../datatable/column-templates/name-with-avatar';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {CloseIcon} from '../../icons/material/Close';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import teamSvg from '../roles/team.svg';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import {DataTableExportCsvButton} from '../../datatable/csv-export/data-table-export-csv-button';
import {ChipList} from '../../ui/forms/input-field/chip-field/chip-list';
import {Chip} from '../../ui/forms/input-field/chip-field/chip';
import {useSettings} from '../../core/settings/use-settings';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {BanUserDialog} from '@common/admin/users/ban-user-dialog';
import {PersonOffIcon} from '@common/icons/material/PersonOff';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {useUnbanUser} from '@common/admin/users/requests/use-unban-user';

const columnConfig: ColumnConfig<User>[] = [
  {
    key: 'name',
    allowsSorting: true,
    sortingKey: 'email',
    width: 'flex-3 min-w-200',
    visibleInMode: 'all',
    header: () => <Trans message="User" />,
    body: user => (
      <NameWithAvatar
        image={user.avatar}
        label={user.display_name}
        description={user.email}
      />
    ),
  },
  {
    key: 'subscribed',
    header: () => <Trans message="Subscribed" />,
    width: 'w-96',
    body: user =>
      user.subscriptions?.length ? (
        <CheckIcon className="icon-md text-positive" />
      ) : (
        <CloseIcon className="icon-md text-danger" />
      ),
  },
  {
    key: 'roles',
    header: () => <Trans message="Roles" />,
    body: user => (
      <ChipList radius="rounded" size="xs">
        {user.roles.map(role => (
          <Chip key={role.id} selectable>
            <Link
              className={clsx('capitalize')}
              target="_blank"
              to={`/admin/roles/${role.id}/edit`}
            >
              <Trans message={role.name} />
            </Link>
          </Chip>
        ))}
      </ChipList>
    ),
  },
  {
    key: 'firstName',
    allowsSorting: true,
    header: () => <Trans message="First name" />,
    body: user => user.first_name,
  },
  {
    key: 'lastName',
    allowsSorting: true,
    header: () => <Trans message="Last name" />,
    body: user => user.last_name,
  },
  {
    key: 'createdAt',
    allowsSorting: true,
    width: 'w-96',
    header: () => <Trans message="Created at" />,
    body: user => (
      <time>
        <FormattedDate date={user.created_at} />
      </time>
    ),
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    width: 'w-84 flex-shrink-0',
    hideHeader: true,
    align: 'end',
    visibleInMode: 'all',
    body: user => (
      <div className="text-muted">
        <Link to={`${user.id}/edit`}>
          <Tooltip label={<Trans message="Edit user" />}>
            <IconButton size="md">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
        {user.banned_at ? (
          <UnbanButton user={user} />
        ) : (
          <DialogTrigger type="modal">
            <Tooltip label={<Trans message="Suspend user" />}>
              <IconButton size="md">
                <PersonOffIcon />
              </IconButton>
            </Tooltip>
            <BanUserDialog user={user} />
          </DialogTrigger>
        )}
      </div>
    ),
  },
];

export function UserIndex() {
  const {billing} = useSettings();

  const filteredColumns = !billing.enable
    ? columnConfig.filter(c => c.key !== 'subscribed')
    : columnConfig;

  return (
    <Fragment>
      <DataTablePage
        endpoint="users"
        title={<Trans message="Users" />}
        filters={UserIndexFilters}
        columns={filteredColumns}
        actions={<Actions />}
        queryParams={{with: 'subscriptions,bans'}}
        selectedActions={<DeleteSelectedItemsAction />}
        emptyStateMessage={
          <DataTableEmptyStateMessage
            image={teamSvg}
            title={<Trans message="No users have been created yet" />}
            filteringTitle={<Trans message="No matching users" />}
          />
        }
      />
    </Fragment>
  );
}

function Actions() {
  return (
    <Fragment>
      <DataTableExportCsvButton endpoint="users/csv/export" />
      <DataTableAddItemButton elementType={Link} to="new">
        <Trans message="Add new user" />
      </DataTableAddItemButton>
    </Fragment>
  );
}

interface UnbanButtonProps {
  user: User;
}
function UnbanButton({user}: UnbanButtonProps) {
  const unban = useUnbanUser(user.id);
  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          unban.mutate();
        }
      }}
    >
      <Tooltip label={<Trans message="Remove suspension" />}>
        <IconButton size="md" color="danger">
          <PersonOffIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        isDanger
        title={
          <Trans message="Suspend “:name“" values={{name: user.display_name}} />
        }
        body={
          <Trans message="Are you sure you want to remove suspension from this user?" />
        }
        confirm={<Trans message="Unsuspend" />}
      />
    </DialogTrigger>
  );
}
