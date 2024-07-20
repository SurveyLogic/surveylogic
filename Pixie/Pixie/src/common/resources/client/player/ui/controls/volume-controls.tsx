import {Slider} from '@common/ui/forms/slider/slider';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {BaseSliderProps} from '@common/ui/forms/slider/base-slider';
import {ButtonProps} from '@common/ui/buttons/button';
import {MediaMuteIcon} from '@common/icons/media/media-mute';
import {MediaVolumeLowIcon} from '@common/icons/media/media-volume-low';
import {MediaVolumeHighIcon} from '@common/icons/media/media-volume-high';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

interface Props {
  trackColor?: BaseSliderProps['trackColor'];
  fillColor?: BaseSliderProps['fillColor'];
  buttonColor?: ButtonProps['color'];
}
export function VolumeControls({trackColor, fillColor, buttonColor}: Props) {
  const volume = usePlayerStore(s => s.volume);
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  return (
    <div className="flex w-min items-center gap-4">
      <ToggleMuteButton color={buttonColor} />
      <Slider
        isDisabled={!playerReady}
        showThumbOnHoverOnly
        thumbSize="w-14 h-14"
        trackColor={trackColor}
        fillColor={fillColor}
        minValue={0}
        maxValue={100}
        className="flex-auto"
        width="w-96"
        value={volume}
        onChange={value => {
          player.setVolume(value);
        }}
      />
    </div>
  );
}

interface ToggleMuteButtonProps {
  color?: ButtonProps['color'];
}
function ToggleMuteButton({color}: ToggleMuteButtonProps) {
  const isMuted = usePlayerStore(s => s.muted);
  const volume = usePlayerStore(s => s.volume);
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  if (isMuted) {
    return (
      <Tooltip label={<Trans message="Unmute" />}>
        <IconButton
          disabled={!playerReady}
          color={color}
          size="sm"
          iconSize="md"
          onClick={() => player.setMuted(false)}
        >
          <MediaMuteIcon />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={<Trans message="Mute" />}>
      <IconButton
        disabled={!playerReady}
        color={color}
        size="sm"
        iconSize="md"
        onClick={() => player.setMuted(true)}
      >
        {volume < 40 ? <MediaVolumeLowIcon /> : <MediaVolumeHighIcon />}
      </IconButton>
    </Tooltip>
  );
}
