import {usePlayerStore} from '@common/player/hooks/use-player-store';
import clsx from 'clsx';
import {HTMLAttributes} from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  hideDuringPlayback?: boolean;
}
export function PlayerPoster({
  className,
  hideDuringPlayback = true,
  ...domProps
}: Props) {
  const posterUrl = usePlayerStore(s => s.posterUrl);
  const shouldHidePoster = usePlayerStore(
    s =>
      hideDuringPlayback && s.playbackStarted && s.providerName !== 'htmlAudio'
  );
  if (!posterUrl) return null;
  return (
    <div
      {...domProps}
      className={clsx(
        'transition-opacity pointer-events-none flex items-center justify-center bg-black w-full max-h-full',
        shouldHidePoster ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      <img
        loading="lazy"
        src={posterUrl}
        alt=""
        className="w-full max-h-full object-cover flex-shrink-0"
      />
    </div>
  );
}
