import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {FormattedDuration} from '@common/i18n/formatted-duration';

interface Props {
  className?: string;
}
export function FormattedPlayerDuration({className}: Props) {
  const duration = usePlayerStore(s => s.mediaDuration);
  return (
    <span className={className}>
      <FormattedDuration
        seconds={duration}
        addZeroToFirstUnit={duration >= 600}
      />
    </span>
  );
}
