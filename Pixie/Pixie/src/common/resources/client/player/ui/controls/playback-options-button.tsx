import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {IconButton} from '@common/ui/buttons/icon-button';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {List, ListItem} from '@common/ui/list/list';
import {Trans} from '@common/i18n/trans';
import {ReactNode, useState} from 'react';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {Button, ButtonProps} from '@common/ui/buttons/button';
import {AnimatePresence, m} from 'framer-motion';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {ArrowRightIcon} from '@common/icons/material/ArrowRight';
import {useDarkThemeVariables} from '@common/ui/themes/use-dark-theme-variables';
import {MediaSettingsIcon} from '@common/icons/media/media-settings';
import {MediaPlaybackSpeedCircleIcon} from '@common/icons/media/media-playback-speed-circle';
import {MediaSettingsMenuIcon} from '@common/icons/media/media-settings-menu';
import {MediaClosedCaptionsIcon} from '@common/icons/media/media-closed-captions';
import {MediaArrowLeftIcon} from '@common/icons/media/media-arrow-left';

type OptionsPanel = 'rate' | 'quality' | 'captions' | 'options';

const Panels = {
  rate: PlaybackRatePanel,
  quality: PlaybackQualityPanel,
  options: OptionsListPanel,
  captions: CaptionsPanel,
};

interface Props {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
  className?: string;
}
export function PlaybackOptionsButton({
  color,
  size,
  iconSize,
  className,
}: Props) {
  const darkThemeVars = useDarkThemeVariables();
  return (
    <DialogTrigger type="popover" placement="top-end">
      <IconButton
        color={color}
        size={size}
        iconSize={iconSize}
        className={className}
      >
        <MediaSettingsIcon />
      </IconButton>
      <Dialog size="w-256" style={darkThemeVars}>
        <DialogBody padding="p-0">
          <PlaybackOptionsPanel />
        </DialogBody>
      </Dialog>
    </DialogTrigger>
  );
}

function PlaybackOptionsPanel() {
  const [activePanel, setActivePanel] = useState<OptionsPanel>('options');
  const PanelComponent = Panels[activePanel];

  return (
    <AnimatePresence initial={false}>
      <PanelComponent
        activePanel={activePanel}
        onActivePanelChange={setActivePanel}
      />
    </AnimatePresence>
  );
}

interface OptionsPanelProps {
  activePanel: OptionsPanel;
  onActivePanelChange: (panel: OptionsPanel) => void;
}
function OptionsListPanel({onActivePanelChange}: OptionsPanelProps) {
  const activeRate = usePlayerStore(s => s.playbackRate);
  const availableQualities = usePlayerStore(s => s.playbackQualities);
  const activeQuality = usePlayerStore(s => s.playbackQuality);
  const availableTextTracks = usePlayerStore(s => s.textTracks);
  const textTrackId = usePlayerStore(s => s.currentTextTrack);
  const currentTextTrack = availableTextTracks[textTrackId];

  return (
    <m.div
      initial={{x: '-100%', opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{x: '100%', opacity: 0}}
      transition={{type: 'tween', duration: 0.14}}
    >
      <List>
        <ListItem
          startIcon={<MediaPlaybackSpeedCircleIcon />}
          endSection={
            <div className="flex items-center gap-2">
              {activeRate}x
              <ArrowRightIcon size="sm" />
            </div>
          }
          onSelected={() => onActivePanelChange('rate')}
        >
          <Trans message="Speed" />
        </ListItem>
        <ListItem
          isDisabled={!availableQualities.length}
          startIcon={<MediaSettingsMenuIcon />}
          endSection={
            <div className="flex items-center gap-2 capitalize">
              {activeQuality ? activeQuality : <Trans message="Auto" />}
              <ArrowRightIcon size="sm" />
            </div>
          }
          onSelected={() => onActivePanelChange('quality')}
        >
          <Trans message="Quality" />
        </ListItem>
        <ListItem
          isDisabled={!availableTextTracks.length}
          startIcon={<MediaClosedCaptionsIcon />}
          endSection={
            <div className="flex items-center gap-2 capitalize">
              {currentTextTrack ? (
                currentTextTrack.label
              ) : (
                <Trans message="None" />
              )}
              <ArrowRightIcon size="sm" />
            </div>
          }
          onSelected={() => onActivePanelChange('captions')}
        >
          <Trans message="Subtitles/CC" />
        </ListItem>
      </List>
    </m.div>
  );
}

function PlaybackRatePanel({
  activePanel,
  onActivePanelChange,
}: OptionsPanelProps) {
  const activeRate = usePlayerStore(s => s.playbackRate);
  const availableRates = usePlayerStore(s => s.playbackRates);
  const player = usePlayerActions();

  return (
    <PanelLayout
      activePanel={activePanel}
      onActivePanelChange={onActivePanelChange}
      title={<Trans message="Playback speed" />}
    >
      <List>
        {availableRates.map(rate => (
          <ListItem
            key={rate}
            showCheckmark
            isSelected={activeRate === rate}
            onSelected={() => {
              player.setPlaybackRate(rate);
              onActivePanelChange('options');
            }}
          >
            {rate}x
          </ListItem>
        ))}
      </List>
    </PanelLayout>
  );
}

function PlaybackQualityPanel({
  activePanel,
  onActivePanelChange,
}: OptionsPanelProps) {
  const activeQuality = usePlayerStore(s => s.playbackQuality);
  const availableQualities = usePlayerStore(s => s.playbackQualities);
  const player = usePlayerActions();

  return (
    <PanelLayout
      activePanel={activePanel}
      onActivePanelChange={onActivePanelChange}
      title={<Trans message="Playback quality" />}
    >
      <List>
        {availableQualities.map(quality => (
          <ListItem
            capitalizeFirst
            key={quality}
            showCheckmark
            isSelected={activeQuality === quality}
            onSelected={() => {
              player.setPlaybackQuality(quality);
              onActivePanelChange('options');
            }}
          >
            {quality}
          </ListItem>
        ))}
      </List>
    </PanelLayout>
  );
}

function CaptionsPanel({activePanel, onActivePanelChange}: OptionsPanelProps) {
  const currentTextTrack = usePlayerStore(s => s.currentTextTrack);
  const textTracks = usePlayerStore(s => s.textTracks);
  const player = usePlayerActions();

  return (
    <PanelLayout
      activePanel={activePanel}
      onActivePanelChange={onActivePanelChange}
      title={<Trans message="Subtitles/Captions" />}
    >
      <List>
        <ListItem
          key="off"
          showCheckmark
          isSelected={currentTextTrack === -1}
          onSelected={() => {
            player.setCurrentTextTrack(-1);
            onActivePanelChange('options');
          }}
        >
          <Trans message="Off" />
        </ListItem>
        {textTracks.map((track, index) => (
          <ListItem
            key={index}
            showCheckmark
            isSelected={currentTextTrack === index}
            onSelected={() => {
              player.setCurrentTextTrack(index);
              onActivePanelChange('options');
            }}
          >
            {track.label}
          </ListItem>
        ))}
      </List>
    </PanelLayout>
  );
}

interface PanelLayoutProps extends OptionsPanelProps {
  children: ReactNode;
  title: ReactNode;
}
function PanelLayout({onActivePanelChange, children, title}: PanelLayoutProps) {
  return (
    <m.div
      initial={{x: '100%', opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{x: '-100%', opacity: 0}}
      transition={{type: 'tween', duration: 0.14}}
    >
      <div className="border-b p-10">
        <Button
          className="w-full"
          color="white"
          justify="justify-start"
          startIcon={<MediaArrowLeftIcon />}
          onClick={() => onActivePanelChange('options')}
        >
          {title}
        </Button>
      </div>
      {children}
    </m.div>
  );
}
