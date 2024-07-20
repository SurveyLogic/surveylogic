import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ButtonProps} from '@common/ui/buttons/button';
import {MediaShuffleIcon} from '@common/icons/media/media-shuffle';
import {MediaShuffleOnIcon} from '@common/icons/media/media-shuffle-on';
import {Trans} from '@common/i18n/trans';
import {Tooltip} from '@common/ui/tooltip/tooltip';

interface Props {
  color?: ButtonProps['color'];
  activeColor?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
}
export function ShuffleButton({
  size = 'md',
  iconSize,
  color,
  activeColor = 'primary',
  className,
}: Props) {
  const playerReady = usePlayerStore(s => s.providerReady);
  const isShuffling = usePlayerStore(s => s.shuffling);
  const player = usePlayerActions();

  const label = isShuffling ? (
    <Trans message="Disable shuffle" />
  ) : (
    <Trans message="Enable shuffle" />
  );

  return (
    <Tooltip label={label}>
      <IconButton
        disabled={!playerReady}
        size={size}
        color={isShuffling ? activeColor : color}
        iconSize={iconSize}
        className={className}
        onClick={() => {
          player.toggleShuffling();
        }}
      >
        {isShuffling ? <MediaShuffleOnIcon /> : <MediaShuffleIcon />}
      </IconButton>
    </Tooltip>
  );
}
