import {User} from '../../../user';
import {AccountSettingsPanel} from '../account-settings-panel';
import {Trans} from '@common/i18n/trans';
import {AccountSettingsId} from '@common/auth/ui/account-settings/account-settings-sidenav';
import {
  ActiveSession,
  useUserSessions,
} from '@common/auth/ui/account-settings/sessions-panel/requests/use-user-sessions';
import {ComputerIcon} from '@common/icons/material/Computer';
import {SmartphoneIcon} from '@common/icons/material/Smartphone';
import {TabletIcon} from '@common/icons/material/Tablet';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';
import {SvgIconProps} from '@common/icons/svg-icon';
import {Fragment, ReactNode} from 'react';
import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {useLogoutOtherSessions} from '@common/auth/ui/account-settings/sessions-panel/requests/use-logout-other-sessions';
import {usePasswordConfirmedAction} from '@common/auth/ui/confirm-password/use-password-confirmed-action';
import {Button} from '@common/ui/buttons/button';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';

interface Props {
  user: User;
}
export function SessionsPanel({user}: Props) {
  const {data, isLoading} = useUserSessions();
  const logoutOther = useLogoutOtherSessions();
  const {withConfirmedPassword, isLoading: checkingPasswordStatus} =
    usePasswordConfirmedAction({needsPassword: true});

  const sessionList = (
    <div className="max-h-400 overflow-y-auto">
      {data?.sessions.map(session => (
        <SessionItem key={session.id} session={session} />
      ))}
    </div>
  );

  return (
    <AccountSettingsPanel
      id={AccountSettingsId.Sessions}
      title={<Trans message="Active sessions" />}
    >
      <p className="text-sm">
        <Trans message="If necessary, you may log out of all of your other browser sessions across all of your devices. Your recent sessions are listed below. If you feel your account has been compromised, you should also update your password." />
      </p>
      <div className="my-30">
        {isLoading ? (
          <div className="min-h-60">
            <ProgressCircle isIndeterminate />
          </div>
        ) : (
          sessionList
        )}
      </div>
      <Button
        variant="outline"
        color="primary"
        disabled={checkingPasswordStatus || logoutOther.isLoading}
        onClick={() => {
          withConfirmedPassword(password => {
            logoutOther.mutate(
              {password: password!},
              {
                onSuccess: () => {
                  toast(message('Logged out other sessions.'));
                },
              }
            );
          });
        }}
      >
        <Trans message="Logout other sessions" />
      </Button>
    </AccountSettingsPanel>
  );
}

interface SessionItemProps {
  session: ActiveSession;
}
function SessionItem({session}: SessionItemProps) {
  return (
    <div className="flex items-start gap-14 text-sm mb-14">
      <div className="flex-shrink-0 text-muted">
        <DeviceIcon device={session.device_type} size="lg" />
      </div>
      <div className="flex-auto">
        <div>
          <ValueOrUnknown>{session.platform}</ValueOrUnknown> -{' '}
          <ValueOrUnknown>{session.browser}</ValueOrUnknown>
        </div>
        <div className="text-xs my-4">
          {session.city}, {session.country}
        </div>
        <div className="text-xs">
          <IpAddress session={session} /> - <LastActive session={session} />
        </div>
      </div>
    </div>
  );
}

interface DeviceIconProps {
  device: ActiveSession['device_type'];
  size: SvgIconProps['size'];
}
function DeviceIcon({device, size}: DeviceIconProps) {
  switch (device) {
    case 'mobile':
      return <SmartphoneIcon size={size} />;
    case 'tablet':
      return <TabletIcon size={size} />;
    default:
      return <ComputerIcon size={size} />;
  }
}

interface LastActiveProps {
  session: ActiveSession;
}
function LastActive({session}: LastActiveProps) {
  if (session.is_current_device) {
    return (
      <span className="text-positive">
        <Trans message="This device" />
      </span>
    );
  }

  return <FormattedRelativeTime date={session.last_active} />;
}

interface IpAddressProps {
  session: ActiveSession;
}
function IpAddress({session}: IpAddressProps) {
  if (session.ip_address) {
    return <span>{session.ip_address}</span>;
  } else if (session.token) {
    return <Trans message="API Token" />;
  }
  return <Trans message="Unknown IP" />;
}

interface ValueOrUnknownProps {
  children: ReactNode;
}
function ValueOrUnknown({children}: ValueOrUnknownProps) {
  return children ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Trans message="Unknown" />
  );
}
