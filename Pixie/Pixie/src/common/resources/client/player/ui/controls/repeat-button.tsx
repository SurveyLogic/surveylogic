import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ButtonProps} from '@common/ui/buttons/button';
import {MediaRepeatIcon} from '@common/icons/media/media-repeat';
import {MediaRepeatOnIcon} from '@common/icons/media/media-repeat-on';
import {Trans} from '@common/i18n/trans';
import {ReactElement} from 'react';
import {Tooltip} from '@common/ui/tooltip/tooltip';

interface Props {
  color?: ButtonProps['color'];
  activeColor?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
}
export function RepeatButton({
  size = 'md',
  iconSize,
  color,
  activeColor = 'primary',
  className,
}: Props) {
  const playerReady = usePlayerStore(s => s.providerReady);
  const repeating = usePlayerStore(s => s.repeat);
  const player = usePlayerActions();

  let label: ReactElement;
  if (repeating === 'all') {
    label = <Trans message="Enable repeat one" />;
  } else if (repeating === 'one') {
    label = <Trans message="Disable repeat" />;
  } else {
    label = <Trans message="Enable repeat" />;
  }

  return (
    <Tooltip label={label}>
      <IconButton
        disabled={!playerReady}
        size={size}
        color={repeating ? activeColor : color}
        iconSize={iconSize}
        className={className}
        onClick={() => {
          player.toggleRepeatMode();
        }}
      >
        {repeating === 'one' ? <MediaRepeatOnIcon /> : <MediaRepeatIcon />}
      </IconButton>
    </Tooltip>
  );
}
