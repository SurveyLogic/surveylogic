import {IllustratedMessage} from '../../ui/images/illustrated-message';
import {SvgImage} from '../../ui/images/svg-image/svg-image';
import notifySvg from './notify.svg';
import {Trans} from '../../i18n/trans';
import {Button} from '../../ui/buttons/button';
import {Link} from 'react-router-dom';
import {useSettings} from '../../core/settings/use-settings';

export function NotificationEmptyStateMessage() {
  const {notif} = useSettings();
  return (
    <IllustratedMessage
      size="sm"
      image={<SvgImage src={notifySvg} />}
      title={<Trans message="Hang tight!" />}
      description={
        <Trans message="Notifications will start showing up here soon." />
      }
      action={
        notif.subs.integrated && (
          <Button
            elementType={Link}
            variant="outline"
            to="/notifications/settings"
            size="xs"
            color="primary"
          >
            <Trans message="Notification settings" />
          </Button>
        )
      }
    />
  );
}
