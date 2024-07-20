import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ButtonProps} from '@common/ui/buttons/button';
import {MediaPreviousIcon} from '@common/icons/media/media-previous';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {Tooltip} from '@common/ui/tooltip/tooltip';

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
  stopPropagation?: boolean;
}
export function PreviousButton({
  size = 'md',
  iconSize,
  color,
  className,
  stopPropagation,
}: Props) {
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  return (
    <Tooltip label={<Trans message="Previous" />}>
      <IconButton
        disabled={!playerReady}
        size={size}
        color={color}
        iconSize={iconSize}
        className={className}
        onClick={e => {
          if (stopPropagation) {
            e.stopPropagation();
          }
          player.playPrevious();
        }}
      >
        <MediaPreviousIcon />
      </IconButton>
    </Tooltip>
  );
}
