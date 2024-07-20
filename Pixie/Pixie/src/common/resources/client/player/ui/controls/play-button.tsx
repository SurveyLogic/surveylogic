import {IconButton} from '@common/ui/buttons/icon-button';
import {ButtonProps} from '@common/ui/buttons/button';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import {MediaPauseIcon} from '@common/icons/media/media-pause';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
  stopPropagation?: boolean;
}
export function PlayButton({
  size = 'md',
  iconSize = 'xl',
  color,
  stopPropagation,
}: Props) {
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const playerReady = usePlayerStore(s => s.providerReady);
  const player = usePlayerActions();

  const label = isPlaying ? (
    <Trans message="Pause (k)" />
  ) : (
    <Trans message="Play (k)" />
  );

  return (
    <Tooltip label={label}>
      <IconButton
        color={color}
        size={size}
        iconSize={iconSize}
        disabled={!playerReady}
        onClick={e => {
          if (stopPropagation) {
            e.stopPropagation();
          }
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        {isPlaying ? <MediaPauseIcon /> : <MediaPlayIcon />}
      </IconButton>
    </Tooltip>
  );
}
