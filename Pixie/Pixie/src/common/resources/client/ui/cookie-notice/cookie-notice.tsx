import clsx from 'clsx';
import {Trans} from '../../i18n/trans';
import {CustomMenuItem} from '../../menus/custom-menu';
import {Button} from '../buttons/button';
import useCookie from 'react-use-cookie';
import {useSettings} from '../../core/settings/use-settings';
import {useState} from 'react';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

export function CookieNotice() {
  const {
    cookie_notice: {position, enable},
  } = useSettings();

  const [, setCookie] = useCookie('cookie_notice');

  const [alreadyAccepted, setAlreadyAccepted] = useState(() => {
    return !getBootstrapData().show_cookie_notice;
  });

  if (!enable || alreadyAccepted) {
    return null;
  }

  return (
    <div
      className={clsx(
        'fixed w-full p-14 bg-toast text-white shadow text-sm flex items-center justify-center gap-30 z-50',
        position == 'top' ? 'top-0' : 'bottom-0'
      )}
    >
      <Trans
        message="We use cookies to optimize site functionality and provide you with the
      best possible experience."
      />
      <InfoLink />
      <Button
        variant="flat"
        color="primary"
        size="xs"
        onClick={() => {
          setCookie('true', {days: 30, path: '/'});
          setAlreadyAccepted(true);
        }}
      >
        <Trans message="OK" />
      </Button>
    </div>
  );
}

function InfoLink() {
  const {
    cookie_notice: {button},
  } = useSettings();

  if (!button?.label) {
    return null;
  }

  return (
    <CustomMenuItem
      className={() => 'text-primary-light hover:underline'}
      item={button}
    />
  );
}
