import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ButtonProps} from '@common/ui/buttons/button';
import {ReactElement} from 'react';
import {SvgIconProps} from '@common/icons/svg-icon';
import {MediaSeekForward15Icon} from '@common/icons/media/media-seek-forward15';

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
  seconds?: number | string;
  children?: ReactElement<SvgIconProps>;
}
export function SeekButton({
  size = 'md',
  iconSize,
  color,
  className,
  seconds = '+15',
  children,
}: Props) {
  const {trans} = useTrans();
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  return (
    <IconButton
      disabled={!playerReady}
      aria-label={trans(message('Next'))}
      size={size}
      color={color}
      iconSize={iconSize}
      className={className}
      onClick={() => {
        player.seek(seconds);
      }}
    >
      {children || <MediaSeekForward15Icon />}
    </IconButton>
  );
}
