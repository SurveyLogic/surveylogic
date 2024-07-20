import {ButtonProps} from '@common/ui/buttons/button';
import {useTrans} from '@common/i18n/use-trans';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {message} from '@common/i18n/message';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';
import {MediaPictureInPictureExitIcon} from '@common/icons/media/media-picture-in-picture-exit';
import {MediaPictureInPictureIcon} from '@common/icons/media/media-picture-in-picture';

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
}
export function PipButton({size = 'md', iconSize, color, className}: Props) {
  const {trans} = useTrans();
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);
  const isPip = usePlayerStore(s => s.isPip);
  const canPip = usePlayerStore(s => s.canPip);

  if (!canPip) {
    return null;
  }

  const labelMessage = trans(
    isPip
      ? message('Exit picture-in-picture (p)')
      : message('Enter picture-in-picture (p)')
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
          if (isPip) {
            player.exitPip();
          } else {
            player.enterPip();
          }
        }}
      >
        {isPip ? (
          <MediaPictureInPictureExitIcon />
        ) : (
          <MediaPictureInPictureIcon />
        )}
      </IconButton>
    </Tooltip>
  );
}
