import {Slider} from '@common/ui/forms/slider/slider';
import {UseSliderProps} from '@common/ui/forms/slider/use-slider';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useCurrentTime} from '@common/player/hooks/use-current-time';
import {useRef} from 'react';

interface Props {
  trackColor?: UseSliderProps['trackColor'];
  fillColor?: UseSliderProps['fillColor'];
  className?: string;
}
export function Seekbar({trackColor, fillColor, className}: Props) {
  const {pause, seek, setIsSeeking, play, getState} = usePlayerActions();
  const duration = usePlayerStore(s => s.mediaDuration);
  const playerReady = usePlayerStore(s => s.providerReady);
  const pauseWhileSeeking = usePlayerStore(s => s.pauseWhileSeeking);

  const currentTime = useCurrentTime();

  const wasPlayingBeforeDragging = useRef(false);

  return (
    <Slider
      fillColor={fillColor}
      trackColor={trackColor}
      thumbSize="w-14 h-14"
      showThumbOnHoverOnly
      className={className}
      width="w-auto"
      isDisabled={!playerReady}
      value={currentTime}
      minValue={0}
      maxValue={duration}
      onPointerDown={() => {
        setIsSeeking(true);
        if (pauseWhileSeeking) {
          wasPlayingBeforeDragging.current =
            getState().isPlaying || getState().isBuffering;
          pause();
        }
      }}
      onChange={value => {
        getState().emit('progress', {currentTime: value});
        seek(value);
      }}
      onChangeEnd={() => {
        setIsSeeking(false);
        if (pauseWhileSeeking && wasPlayingBeforeDragging.current) {
          play();
          wasPlayingBeforeDragging.current = false;
        }
      }}
    />
  );
}
