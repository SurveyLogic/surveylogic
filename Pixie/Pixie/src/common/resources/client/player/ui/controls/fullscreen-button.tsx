import {ButtonProps} from '@common/ui/buttons/button';
import {useTrans} from '@common/i18n/use-trans';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {message} from '@common/i18n/message';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';
import {MediaFullscreenExitIcon} from '@common/icons/media/media-fullscreen-exit';
import {MediaFullscreenIcon} from '@common/icons/media/media-fullscreen';

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
}
export function FullscreenButton({
  size = 'md',
  iconSize,
  color,
  className,
}: Props) {
  const {trans} = useTrans();
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);
  const isFullscreen = usePlayerStore(s => s.isFullscreen);
  const canFullscreen = usePlayerStore(s => s.canFullscreen);

  if (!canFullscreen) {
    return null;
  }

  const labelMessage = trans(
    isFullscreen
      ? message('Exit fullscreen (f)')
      : message('Enter fullscreen (f)')
  );

  return (
    <Tooltip label={<Trans message={labelMessage} />}>
      <IconButton
        disabled={!playerReady}
        aria-label={labelMessage}
        size={size}
        color={color}
        iconSize={iconSize}
        className={className}
        onClick={() => {
          if (isFullscreen) {
            player.exitFullscreen();
          } else {
            player.enterFullscreen();
          }
        }}
      >
        {isFullscreen ? <MediaFullscreenExitIcon /> : <MediaFullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
}
