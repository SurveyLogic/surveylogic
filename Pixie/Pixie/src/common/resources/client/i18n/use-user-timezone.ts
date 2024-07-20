import {useContext, useMemo} from 'react';
import {BoostrapDataContext} from '../core/bootstrap-data/bootstrap-data-context';
import {getLocalTimeZone} from '@internationalized/date';

export function useUserTimezone(): string {
  const {
    data: {user, settings},
  } = useContext(BoostrapDataContext);
  const defaultTimezone = settings.dates.default_timezone;
  const preferredTimezone = user?.timezone || defaultTimezone || 'auto';

  return useMemo(() => {
    return !preferredTimezone || preferredTimezone === 'auto'
      ? getLocalTimeZone()
      : preferredTimezone;
  }, [preferredTimezone]);
}
