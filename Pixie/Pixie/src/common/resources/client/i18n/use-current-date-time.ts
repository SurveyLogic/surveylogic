import {useMemo} from 'react';
import {now} from '@internationalized/date';
import {useUserTimezone} from './use-user-timezone';

export function useCurrentDateTime() {
  const timezone = useUserTimezone();
  return useMemo(() => {
    return now(timezone);
  }, [timezone]);
}
