import {Fragment} from 'react';
import {PlayerContext} from '@common/player/player-context';
import {MediaItem} from '@common/player/media-item';
import {PlayerOutlet} from '@common/player/ui/player-outlet';
import {PlayButton} from '@common/player/ui/controls/play-button';
import {VolumeControls} from '@common/player/ui/controls/volume-controls';
import {Seekbar} from '@common/player/ui/controls/seeking/seekbar';
import {FormattedCurrentTime} from '@common/player/ui/controls/formatted-current-time';
import {FormattedPlayerDuration} from '@common/player/ui/controls/formatted-player-duration';
import {PlaybackOptionsButton} from '@common/player/ui/controls/playback-options-button';
import clsx from 'clsx';
import {SeekButton} from '@common/player/ui/controls/seeking/seek-button';
import {Forward10Icon} from '@common/icons/material/Forward10';
import {UndoIcon} from '@common/icons/material/Undo';

const mediaItem: MediaItem = {
  id: 'test1',
  src: 'storage/title-videos/pLiHKnN3dXz0Ep0rVrgiZ4mSS0lyDV8fnrcwmDOE.mp4',
  poster: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
  provider: 'htmlAudio',
};

const mediaItem2: MediaItem = {
  id: 'test2',
  src: '0G3_kG5FFfQ',
  provider: 'youtube',
};

interface Props {
  className?: string;
}
export function AudioPlayer({className}: Props) {
  return (
    <PlayerContext
      id="audio"
      options={{
        initialData: {
          queue: [mediaItem2, mediaItem],
          cuedMediaId: 'test1',
        },
      }}
    >
      <div className={clsx(className, 'shadow rounded')}>
        <Player />
      </div>
    </PlayerContext>
  );
}

function Player() {
  return (
    <Fragment>
      <PlayerOutlet className="w-full h-full" />
      <Controls />
    </Fragment>
  );
}

function Controls() {
  return (
    <div className="flex items-center gap-24 p-14 text-sm">
      <div className="flex items-center gap-4">
        <SeekButton seconds="-15">
          <UndoIcon />
        </SeekButton>
        <PlayButton />
        <SeekButton seconds="+15">
          <Forward10Icon />
        </SeekButton>
      </div>
      <FormattedCurrentTime className="min-w-40 text-right" />
      <Seekbar fillColor="bg-black" trackColor="bg-black/20" />
      <FormattedPlayerDuration className="min-w-40 text-right" />
      <div className="flex items-center gap-4">
        <PlaybackOptionsButton />
        <VolumeControls fillColor="bg-black" trackColor="bg-black/20" />
      </div>
    </div>
  );
}
