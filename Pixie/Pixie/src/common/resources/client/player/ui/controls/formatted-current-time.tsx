import {useCurrentTime} from '@common/player/hooks/use-current-time';
import {FormattedDuration} from '@common/i18n/formatted-duration';
import {usePlayerStore} from '@common/player/hooks/use-player-store';

interface Props {
  className?: string;
}
export function FormattedCurrentTime({className}: Props) {
  const duration = usePlayerStore(s => s.mediaDuration);
  const currentTime = useCurrentTime();
  return (
    <span className={className}>
      <FormattedDuration
        seconds={currentTime}
        addZeroToFirstUnit={duration >= 600}
      />
    </span>
  );
}
