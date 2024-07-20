import {
  NotificationListItem,
  NotificationListItemProps,
} from '../../notifications/notification-list';
import {
  DatabaseNotification,
  DatabaseNotificationData,
} from '../../notifications/database-notification';
import {useJoinWorkspace} from '../requests/join-workspace';
import {useDeleteInvite} from '../requests/delete-invite';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';

export interface WorkspaceInviteNotification extends DatabaseNotification {
  data: DatabaseNotificationData & {inviteId: string};
}

export function WorkspaceInviteNotificationRenderer(
  props: NotificationListItemProps
) {
  const {notification} = props;
  const joinWorkspace = useJoinWorkspace();
  const deleteInvite = useDeleteInvite();
  const dialogContextValue = useDialogContext();

  return (
    <NotificationListItem
      {...props}
      onActionButtonClick={(e, {action}) => {
        const data = (notification as WorkspaceInviteNotification).data;
        if (action === 'join') {
          joinWorkspace.mutate({
            inviteId: data.inviteId,
          });
        }
        if (action === 'decline') {
          deleteInvite.mutate({
            inviteId: data.inviteId,
          });
        }
        dialogContextValue?.close();
      }}
    />
  );
}
