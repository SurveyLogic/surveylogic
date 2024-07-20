import {NotificationList} from './notification-list';
import {useUserNotifications} from './dialog/requests/user-notifications';
import {ProgressCircle} from '../ui/progress/progress-circle';
import {NotificationEmptyStateMessage} from './empty-state/notification-empty-state-message';
import {Navbar} from '../ui/navigation/navbar/navbar';
import {Trans} from '../i18n/trans';
import {useMarkNotificationsAsRead} from './requests/use-mark-notifications-as-read';
import {useAuth} from '../auth/use-auth';
import {Button} from '../ui/buttons/button';
import {DoneAllIcon} from '../icons/material/DoneAll';
import {StaticPageTitle} from '../seo/static-page-title';

export function NotificationsPage() {
  const {user} = useAuth();
  const {data, isLoading} = useUserNotifications({perPage: 30});
  const hasUnread = !!user?.unread_notifications_count;
  const markAsRead = useMarkNotificationsAsRead();

  const handleMarkAsRead = () => {
    if (!data) return;
    markAsRead.mutate({
      ids: data.pagination.data.map(n => n.id),
    });
  };

  const markAsReadButton = (
    <Button
      variant="outline"
      color="primary"
      size="xs"
      startIcon={<DoneAllIcon />}
      onClick={handleMarkAsRead}
      disabled={markAsRead.isLoading || isLoading}
      className="ml-auto"
    >
      <Trans message="Mark all as read" />
    </Button>
  );

  return (
    <div className="flex flex-col h-full">
      <StaticPageTitle>
        <Trans message="Notifications" />
      </StaticPageTitle>
      <Navbar menuPosition="notifications-page" className="flex-shrink-0" />
      <div className="overflow-y-auto">
        <div className="container mx-auto p-16 md:p-24 flex-auto">
          <div className="flex items-center gap-24 mb-30">
            <h1 className="text-3xl">
              <Trans message="Notifications" />
            </h1>
            {hasUnread && markAsReadButton}
          </div>
          <PageContent />
        </div>
      </div>
    </div>
  );
}

function PageContent() {
  const {data, isLoading} = useUserNotifications({perPage: 30});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <ProgressCircle aria-label="Loading notifications..." isIndeterminate />
      </div>
    );
  }
  if (!data?.pagination.data.length) {
    return <NotificationEmptyStateMessage />;
  }
  return (
    <NotificationList
      className="rounded border"
      notifications={data.pagination.data}
    />
  );
}
