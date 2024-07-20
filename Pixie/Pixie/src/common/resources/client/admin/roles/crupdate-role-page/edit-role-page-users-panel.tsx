import {Role} from '../../../auth/role';
import {ColumnConfig} from '../../../datatable/column-config';
import {User} from '../../../auth/user';
import {Trans} from '../../../i18n/trans';
import {NameWithAvatar} from '../../../datatable/column-templates/name-with-avatar';
import {FormattedDate} from '../../../i18n/formatted-date';
import React from 'react';
import teamSvg from '../team.svg';
import {DialogTrigger} from '../../../ui/overlays/dialog/dialog-trigger';
import {Button} from '../../../ui/buttons/button';
import {SelectUserDialog} from '../../../users/select-user-dialog';
import {queryClient} from '../../../http/query-client';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {DataTableEmptyStateMessage} from '../../../datatable/page/data-table-emty-state-message';
import {useDataTable} from '../../../datatable/page/data-table-context';
import {ConfirmationDialog} from '../../../ui/overlays/dialog/confirmation-dialog';
import {useRemoveUsersFromRole} from '../requests/use-remove-users-from-role';
import {useAddUsersToRole} from '../requests/use-add-users-to-role';
import {DataTable} from '../../../datatable/data-table';
import {useIsMobileMediaQuery} from '../../../utils/hooks/is-mobile-media-query';

const userColumn: ColumnConfig<User> = {
  key: 'name',
  allowsSorting: true,
  sortingKey: 'email',
  header: () => <Trans message="User" />,
  body: user => (
    <NameWithAvatar
      image={user.avatar}
      label={user.display_name}
      description={user.email}
    />
  ),
  width: 'col-w-3',
};

const desktopColumns: ColumnConfig<User>[] = [
  userColumn,
  {
    key: 'first_name',
    allowsSorting: true,
    header: () => <Trans message="First name" />,
    body: user => user.first_name,
  },
  {
    key: 'last_name',
    allowsSorting: true,
    header: () => <Trans message="Last name" />,
    body: user => user.last_name,
  },
  {
    key: 'created_at',
    allowsSorting: true,
    header: () => <Trans message="Assigned at" />,
    body: user => <FormattedDate date={user.created_at} />,
  },
];

const mobileColumns: ColumnConfig<User>[] = [userColumn];

interface CrupdateRolePageUsersPanelProps {
  role: Role;
}
export function EditRolePageUsersPanel({
  role,
}: CrupdateRolePageUsersPanelProps) {
  const isMobile = useIsMobileMediaQuery();

  if (role.guests || role.type === 'workspace') {
    return (
      <div className="pt-30 pb-10">
        <DataTableEmptyStateMessage
          image={teamSvg}
          title={<Trans message="Users can't be assigned to this role" />}
        />
      </div>
    );
  }

  return (
    <DataTable
      endpoint="users"
      columns={isMobile ? mobileColumns : desktopColumns}
      queryParams={{roleId: `${role.id}`}}
      actions={<AssignUserAction role={role} />}
      selectedActions={<RemoveUsersAction role={role} />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={teamSvg}
          title={
            <Trans message="No users have been assigned to this role yet" />
          }
          filteringTitle={<Trans message="No matching users" />}
        />
      }
    />
  );
}

interface AssignUserActionProps {
  role: Role;
}
function AssignUserAction({role}: AssignUserActionProps) {
  const addUsers = useAddUsersToRole(role);
  return (
    <DialogTrigger type="modal">
      <Button variant="flat" color="primary" disabled={addUsers.isLoading}>
        <Trans message="Assign user" />
      </Button>
      <SelectUserDialog
        onUserSelected={user => {
          addUsers.mutate(
            {userIds: [user.id as number]},
            {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  DatatableDataQueryKey('users', {roleId: `${role.id}`})
                );
              },
            }
          );
        }}
      />
    </DialogTrigger>
  );
}

type RemoveUsersActionProps = {
  role: Role;
};
export function RemoveUsersAction({role}: RemoveUsersActionProps) {
  const removeUsers = useRemoveUsersFromRole(role);
  const {selectedRows} = useDataTable();

  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          removeUsers.mutate(
            {userIds: selectedRows as number[]},
            {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  DatatableDataQueryKey('users', {roleId: `${role.id}`})
                );
              },
            }
          );
        }
      }}
    >
      <Button variant="flat" color="danger" disabled={removeUsers.isLoading}>
        <Trans message="Remove users" />
      </Button>
      <ConfirmationDialog
        title={
          <Trans
            message="Remove [one 1 user|other :count users] from “:name“ role?"
            values={{count: selectedRows.length, name: role.name}}
          />
        }
        body={<Trans message="This will permanently remove the users." />}
        confirm={<Trans message="Remove" />}
        isDanger
      />
    </DialogTrigger>
  );
}
