import {
  ProgressCircle,
  ProgressCircleProps,
} from '@common/ui/progress/progress-circle';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';

interface Props {
  className?: string;
  trackColor?: string;
  fillColor?: string;
  size?: ProgressCircleProps['size'];
}
export function BufferingSpinner({
  className,
  trackColor,
  fillColor,
  size,
}: Props) {
  const isActive = usePlayerStore(
    s => s.isBuffering || (s.playbackStarted && !s.providerReady)
  );
  return (
    <AnimatePresence initial={false}>
      {isActive && (
        <m.div {...opacityAnimation} className={className}>
          <ProgressCircle
            isIndeterminate
            trackColor={trackColor}
            fillColor={fillColor}
            size={size}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
