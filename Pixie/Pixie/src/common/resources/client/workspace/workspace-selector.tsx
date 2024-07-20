import clsx from 'clsx';
import {cloneElement, Fragment, ReactElement, useEffect, useState} from 'react';
import {ButtonBase} from '../ui/buttons/button-base';
import {PersonalWorkspace, useUserWorkspaces} from './user-workspaces';
import {UnfoldMoreIcon} from '../icons/material/UnfoldMore';
import {AddIcon} from '../icons/material/Add';
import {NewWorkspaceDialog} from './new-workspace-dialog';
import {WorkspaceMembersDialog} from './workspace-members-dialog';
import {useActiveWorkspaceId} from './active-workspace-id-context';
import {DialogTrigger} from '../ui/overlays/dialog/dialog-trigger';
import {Workspace} from './types/workspace';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {Button, ButtonProps} from '../ui/buttons/button';
import {CheckIcon} from '../icons/material/Check';
import {Menu, MenuItem, MenuTrigger} from '../ui/navigation/menu/menu-trigger';
import {KeyboardArrowDownIcon} from '../icons/material/KeyboardArrowDown';
import {PersonAddIcon} from '../icons/material/PersonAdd';
import {DeleteIcon} from '../icons/material/Delete';
import {ExitToAppIcon} from '../icons/material/ExitToApp';
import {EditIcon} from '../icons/material/Edit';
import {RenameWorkspaceDialog} from './rename-workspace-dialog';
import {ConfirmationDialog} from '../ui/overlays/dialog/confirmation-dialog';
import {useDeleteWorkspace} from './requests/delete-workspace';
import {useRemoveMember} from './requests/remove-member';
import {useAuth} from '../auth/use-auth';
import {Trans} from '../i18n/trans';
import {LeaveWorkspaceConfirmation} from './leave-workspace-confirmation';

type ActiveDialogName =
  | 'workspaceMembers'
  | 'updateWorkspace'
  | 'deleteWorkspace'
  | 'leaveWorkspace';
type ActiveDialog =
  | {name: ActiveDialogName; workspace: Workspace}
  | {name: 'newWorkspace'}
  | null;

interface WorkspaceSelectorProps {
  className?: string;
  onChange?: (id: number) => void;
  trigger?: ReactElement<ButtonProps>;
}
export function WorkspaceSelector({
  onChange,
  className,
  trigger: propsTrigger,
}: WorkspaceSelectorProps) {
  const {data, isFetched, isFetching} = useUserWorkspaces();
  const {workspaceId, setWorkspaceId} = useActiveWorkspaceId();
  const activeWorkspace = data?.find(w => w.id === workspaceId);
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const {hasPermission} = useAuth();

  // if user no longer has access to previously selected workspace, select personal one
  useEffect(() => {
    // make sure we don't unset active workspace while user workspaces are being re-fetched
    if (isFetched && !isFetching && !activeWorkspace) {
      setWorkspaceId(PersonalWorkspace.id);
    }
  }, [activeWorkspace, data, setWorkspaceId, isFetched, isFetching]);

  if (!activeWorkspace || !hasPermission('workspaces.create')) return null;

  const defaultTrigger = (
    <ButtonBase
      className={clsx(
        'flex items-center gap-10 hover:bg-hover rounded ring-inset focus-visible:ring-2',
        className
      )}
    >
      <span className="block flex-auto mr-auto text-left overflow-hidden">
        <span className="block text-sm text-main font-medium overflow-hidden overflow-ellipsis">
          {activeWorkspace.default ? (
            <Trans message={activeWorkspace.name} />
          ) : (
            activeWorkspace.name
          )}
        </span>
        <span className="block text-muted text-xs">
          {activeWorkspace.default ? (
            <Trans message="Personal workspace" />
          ) : (
            <Trans
              message=":count members"
              values={{count: activeWorkspace.members_count}}
            />
          )}
        </span>
      </span>
      <UnfoldMoreIcon className="icon-md shrink-0" />
    </ButtonBase>
  );

  const trigger = propsTrigger || defaultTrigger;

  return (
    <Fragment>
      <DialogTrigger
        type="popover"
        isOpen={selectorIsOpen}
        onClose={() => {
          setSelectorIsOpen(false);
        }}
      >
        {cloneElement(trigger, {
          onClick: () => setSelectorIsOpen(!selectorIsOpen),
        })}
        <Dialog size="min-w-320">
          <DialogBody padding="p-10">
            <div className="mb-16 pb-10 border-b">
              {data!.map(workspace => (
                <WorkspaceItem
                  key={workspace.id}
                  workspace={workspace}
                  setDialog={setDialog}
                  setSelectorIsOpen={setSelectorIsOpen}
                  onChange={onChange}
                />
              ))}
            </div>
            <div className="text-center mb-4 px-4">
              <Button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialog({name: 'newWorkspace'});
                  setSelectorIsOpen(false);
                }}
                variant="outline"
                startIcon={<AddIcon />}
                color="primary"
                className="w-full h-40"
              >
                <Trans message="Create new workspace" />
              </Button>
            </div>
          </DialogBody>
        </Dialog>
      </DialogTrigger>
      <DialogContainer
        dialog={dialog}
        setDialog={setDialog}
        onChange={onChange}
      />
    </Fragment>
  );
}

interface WorkspaceItemProps {
  workspace: Workspace;
  onChange: WorkspaceSelectorProps['onChange'];
  setSelectorIsOpen: (value: boolean) => void;
  setDialog: (value: ActiveDialog) => void;
}
function WorkspaceItem({
  workspace,
  onChange,
  setSelectorIsOpen,
  setDialog,
}: WorkspaceItemProps) {
  const {workspaceId, setWorkspaceId} = useActiveWorkspaceId();
  const isActive = workspaceId === workspace.id;

  return (
    <div
      onClick={() => {
        setWorkspaceId(workspace.id);
        onChange?.(workspace.id);
        setSelectorIsOpen(false);
      }}
      className={clsx(
        'p-10 mb-4 text-left flex items-center gap-12 rounded-lg cursor-pointer',
        isActive && 'bg-primary/5',
        !isActive && 'hover:bg-hover'
      )}
    >
      <CheckIcon
        size="sm"
        className={clsx('flex-shrink-0 text-primary', !isActive && 'invisible')}
      />
      <div className="flex-auto">
        <div className={clsx('text-sm', isActive && 'font-semibold')}>
          {workspace.name}
        </div>
        <div className="text-muted text-sm">
          {workspace.default ? (
            <Trans message="Personal workspace" />
          ) : (
            <Trans
              message=":count members"
              values={{count: workspace.members_count}}
            />
          )}
        </div>
      </div>
      {workspace.id !== 0 && (
        <ManageButton
          setSelectorIsOpen={setSelectorIsOpen}
          workspace={workspace}
          setDialog={setDialog}
        />
      )}
    </div>
  );
}

interface DialogContainerProps {
  dialog: ActiveDialog;
  setDialog: (value: ActiveDialog) => void;
  onChange?: WorkspaceSelectorProps['onChange'];
}
function DialogContainer({dialog, setDialog, onChange}: DialogContainerProps) {
  const deleteWorkspace = useDeleteWorkspace();
  const removeMember = useRemoveMember();
  const {user} = useAuth();
  const {setWorkspaceId} = useActiveWorkspaceId();

  return (
    <DialogTrigger
      type="modal"
      isOpen={!!dialog?.name}
      onClose={value => {
        if (dialog?.name === 'deleteWorkspace' && value) {
          deleteWorkspace.mutate({id: dialog.workspace.id});
        }
        if (dialog?.name === 'leaveWorkspace' && value && user?.id) {
          removeMember.mutate({
            workspaceId: dialog.workspace.id,
            memberId: user.id,
            memberType: 'member',
          });
        }
        if (dialog?.name === 'newWorkspace' && value) {
          setWorkspaceId(value);
          onChange?.(value);
        }
        setDialog(null);
      }}
    >
      {dialog?.name === 'newWorkspace' && <NewWorkspaceDialog />}
      {dialog?.name === 'updateWorkspace' && (
        <RenameWorkspaceDialog workspace={dialog.workspace} />
      )}
      {dialog?.name === 'workspaceMembers' && (
        <WorkspaceMembersDialog workspace={dialog.workspace} />
      )}
      {dialog?.name === 'deleteWorkspace' && (
        <DeleteWorkspaceConfirmation workspace={dialog.workspace} />
      )}
      {dialog?.name === 'leaveWorkspace' && <LeaveWorkspaceConfirmation />}
    </DialogTrigger>
  );
}

interface DeleteWorkspaceConfirmationProps {
  workspace: Workspace;
}
function DeleteWorkspaceConfirmation({
  workspace,
}: DeleteWorkspaceConfirmationProps) {
  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Delete workspace" />}
      body={
        <Trans
          message="Are you sure you want to delete “:name“?"
          values={{name: workspace.name}}
        />
      }
      confirm={<Trans message="Delete" />}
    />
  );
}

interface ManageButtonProps {
  setSelectorIsOpen: (value: boolean) => void;
  setDialog: (dialog: ActiveDialog) => void;
  workspace: Workspace;
}
function ManageButton({
  setSelectorIsOpen,
  setDialog,
  workspace,
}: ManageButtonProps) {
  const {user} = useAuth();

  return (
    <MenuTrigger
      onItemSelected={value => {
        setSelectorIsOpen(false);
        setDialog({name: value as ActiveDialogName, workspace});
      }}
    >
      <Button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        color="primary"
        size="xs"
        variant="outline"
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Trans message="Manage" />
      </Button>
      <Menu>
        <MenuItem
          onClick={e => e.stopPropagation()}
          value="workspaceMembers"
          startIcon={<PersonAddIcon />}
        >
          <Trans message="Members" />
        </MenuItem>
        {workspace.owner_id === user?.id && (
          <MenuItem
            onClick={e => e.stopPropagation()}
            value="updateWorkspace"
            startIcon={<EditIcon />}
          >
            <Trans message="Rename" />
          </MenuItem>
        )}
        {workspace.owner_id !== user?.id && (
          <MenuItem
            onClick={e => e.stopPropagation()}
            value="leaveWorkspace"
            startIcon={<ExitToAppIcon />}
          >
            <Trans message="Leave" />
          </MenuItem>
        )}
        {workspace.owner_id === user?.id && (
          <MenuItem
            onClick={e => e.stopPropagation()}
            value="deleteWorkspace"
            startIcon={<DeleteIcon />}
          >
            <Trans message="Delete" />
          </MenuItem>
        )}
      </Menu>
    </MenuTrigger>
  );
}
