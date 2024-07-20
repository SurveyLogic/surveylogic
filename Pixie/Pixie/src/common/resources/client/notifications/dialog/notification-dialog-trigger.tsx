import {IconButton} from '../../ui/buttons/icon-button';
import {NotificationsIcon} from '../../icons/material/Notifications';
import {Button} from '../../ui/buttons/button';
import {useUserNotifications} from './requests/user-notifications';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {NotificationList} from '../notification-list';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {Trans} from '../../i18n/trans';
import {useAuth} from '../../auth/use-auth';
import {Badge} from '../../ui/badge/badge';
import {DoneAllIcon} from '../../icons/material/DoneAll';
import {useMarkNotificationsAsRead} from '../requests/use-mark-notifications-as-read';
import {NotificationEmptyStateMessage} from '../empty-state/notification-empty-state-message';

interface NotificationDialogTriggerProps {
  className?: string;
}
export function NotificationDialogTrigger({
  className,
}: NotificationDialogTriggerProps) {
  const {user} = useAuth();
  const query = useUserNotifications();
  const markAsRead = useMarkNotificationsAsRead();
  const hasUnread = !!user?.unread_notifications_count;

  const handleMarkAsRead = () => {
    if (!query.data) return;
    markAsRead.mutate({
      ids: query.data.pagination.data.map(n => n.id),
    });
  };

  return (
    <DialogTrigger type="popover">
      <Badge
        badgeLabel={user?.unread_notifications_count}
        badgeIsVisible={hasUnread}
      >
        <IconButton size="md" className={className}>
          <NotificationsIcon />
        </IconButton>
      </Badge>
      <Dialog>
        <DialogHeader
          showDivider
          rightAdornment={
            hasUnread && (
              <Button
                variant="text"
                color="primary"
                size="xs"
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAsRead}
                disabled={markAsRead.isLoading}
              >
                <Trans message="Mark all as read" />
              </Button>
            )
          }
        >
          <Trans message="Notifications" />
        </DialogHeader>
        <DialogBody padding="p-0">
          <DialogContent />
        </DialogBody>
      </Dialog>
    </DialogTrigger>
  );
}

function DialogContent() {
  const {data, isLoading} = useUserNotifications();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-24 py-20">
        <ProgressCircle aria-label="Loading notifications..." isIndeterminate />
      </div>
    );
  }
  if (!data?.pagination.data.length) {
    return (
      <div className="px-24 py-20">
        <NotificationEmptyStateMessage />
      </div>
    );
  }
  return (
    <div>
      <NotificationList notifications={data.pagination.data} />
    </div>
  );
}
