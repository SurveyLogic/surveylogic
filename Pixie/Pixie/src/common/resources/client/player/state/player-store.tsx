import {createStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {MediaItem} from '@common/player/media-item';
import {setInLocalStorage as _setInLocalStorage} from '@common/utils/hooks/local-storage';
import {shuffleArray} from '@common/utils/array/shuffle-array';
import {PlayerStoreOptions} from '@common/player/state/player-store-options';
import {getPlayerStateFromLocalStorage} from '@common/player/utils/player-local-storage';
import {prependToArrayAtIndex} from '@common/utils/array/prepend-to-array-at-index';
import deepMerge from 'deepmerge';
import {resetMediaSession} from '@common/player/utils/reset-media-session';
import {playerQueue} from '@common/player/player-queue';
import type {
  PlayerState,
  ProviderListeners,
  RepeatMode,
} from '@common/player/state/player-state';
import {handlePlayerKeybinds} from '@common/player/handle-player-keybinds';
import {initPlayerMediaSession} from '@common/player/utils/init-player-media-session';
import {isSameMedia} from '@common/player/utils/is-same-media';
import {
  createFullscreenSlice,
  FullscreenSlice,
} from '@common/player/state/fullscreen/fullscreen-slice';
import {createPipSlice, PipSlice} from '@common/player/state/pip/pip-slice';
import {subscribeWithSelector} from 'zustand/middleware';

// todo: add option to show title in top left corner, same as vidstack

export const createPlayerStore = (
  id: string | number,
  options: PlayerStoreOptions
) => {
  // initialData from options should take priority over local storage data
  const initialData = deepMerge(
    getPlayerStateFromLocalStorage(id, options),
    options.initialData || {}
  );

  const setInLocalStorage = (key: string, value: any) => {
    _setInLocalStorage(`player.${id}.${key}`, value);
  };

  return createStore<PlayerState & FullscreenSlice & PipSlice>()(
    subscribeWithSelector(
      immer((set, get, store) => {
        const listeners = new Set<Partial<ProviderListeners>>();
        const internalListeners: Partial<ProviderListeners> = {
          play: () => {
            set(s => {
              s.isPlaying = true;
              s.playbackStarted = true;
            });
          },
          pause: () => {
            set(s => {
              s.isPlaying = false;
              s.controlsVisible = true;
            });
          },
          error: () => {
            set(s => {
              s.isPlaying = false;
            });
          },
          durationChange: payload => {
            set({mediaDuration: payload.duration});
          },
          streamTypeChange: payload => {
            set({streamType: payload.streamType});
          },
          buffered: payload => {
            //
          },
          playbackRateChange: payload => {
            set({playbackRate: payload.rate});
          },
          playbackRates: ({rates}) => {
            set({playbackRates: rates});
          },
          playbackQualities: ({qualities}) => {
            set({playbackQualities: qualities});
          },
          playbackQualityChange: ({quality}) => {
            set({playbackQuality: quality});
          },
          textTracks: ({tracks}) => {
            set({textTracks: tracks});
          },
          currentTextTrackChange: ({trackId}) => {
            set({currentTextTrack: trackId});
          },
          textTrackVisibilityChange: ({isVisible}) => {
            set({textTrackIsVisible: isVisible});
          },
          buffering: ({isBuffering}) => {
            set({isBuffering});
          },
          playbackEnd: async () => {
            const media = get().cuedMedia;

            // don't play next or repeat while seeking via seekbar
            if (get().isSeeking) return;
            if (queue.isLast() && options.loadMoreMediaItems) {
              const items = await options.loadMoreMediaItems(media);
              if (items?.length) {
                get().appendToQueue(items);
              }
            }
            get().playNext();
          },
          posterLoaded: ({url}) => {
            set({posterUrl: url});
          },
          providerReady: () => {
            const provider = get().providerApi;
            if (provider) {
              provider.setVolume(get().volume);
              provider.setMuted(get().muted);
              set({providerReady: true});
            }
          },
        };

        const queue = playerQueue(get);

        const keybindsHandler = (e: KeyboardEvent) => {
          handlePlayerKeybinds(e, get);
        };

        const initialQueue = initialData.queue || [];
        return {
          options,
          ...createFullscreenSlice(set, get, store, listeners),
          ...createPipSlice(set, get, store, listeners),
          originalQueue: initialQueue,
          shuffledQueue: initialData.state?.shuffling
            ? shuffleArray(initialQueue)
            : initialQueue,
          isPlaying: false,
          isBuffering: false,
          streamType: null,
          playbackStarted: false,
          providerReady: false,
          pauseWhileSeeking: options.pauseWhileSeeking ?? true,
          isSeeking: false,
          setIsSeeking: (isSeeking: boolean) => {
            set({isSeeking});
          },
          controlsVisible: true,
          setControlsVisible: (isVisible: boolean) => {
            set(s => {
              s.controlsVisible = isVisible;
            });
          },
          volume: initialData.state?.volume ?? 30,
          setVolume: value => {
            get().providerApi?.setVolume(value);
            set(s => {
              s.volume = value;
            });
            setInLocalStorage('volume', value);
          },
          muted: initialData.state?.muted ?? false,
          setMuted: isMuted => {
            get().providerApi?.setMuted(isMuted);
            set(s => {
              s.muted = isMuted;
            });
            setInLocalStorage('muted', isMuted);
          },
          playbackRates: [],
          playbackRate: 1,
          setPlaybackRate: speed => {
            get().providerApi?.setPlaybackRate(speed);
          },
          playbackQuality: 'auto',
          setPlaybackQuality: quality => {
            get().providerApi?.setPlaybackQuality?.(quality);
          },
          playbackQualities: [],
          repeat: initialData.state?.repeat ?? 'all',
          toggleRepeatMode: () => {
            let newRepeat: RepeatMode = 'all';
            const currentRepeat = get().repeat;
            if (currentRepeat === 'all') {
              newRepeat = 'one';
            } else if (currentRepeat === 'one') {
              newRepeat = false;
            }

            set({repeat: newRepeat});
            setInLocalStorage('repeat', newRepeat);
          },
          shuffling: initialData.state?.shuffling ?? false,
          toggleShuffling: () => {
            let newQueue: MediaItem[] = [];

            if (get().shuffling) {
              newQueue = get().originalQueue;
            } else {
              newQueue = shuffleArray([...get().shuffledQueue]);
            }

            set(s => {
              s.shuffling = !s.shuffling;
              s.shuffledQueue = newQueue;
            });
          },
          mediaDuration: 0,
          seek: time => {
            const timeStr = `${time}`;
            if (timeStr.startsWith('+')) {
              time = get().getCurrentTime() + Number(time);
            } else if (timeStr.startsWith('-')) {
              time = get().getCurrentTime() - Number(timeStr.replace('-', ''));
            } else {
              time = Number(time);
            }
            get().providerApi?.seek(time);
            get().emit('seek', {time});
          },
          getCurrentTime: () => {
            return get().providerApi?.getCurrentTime() || 0;
          },
          play: async media => {
            // get currently active queue item, if none is provided
            if (media) {
              await get().cue(media);
            } else {
              media = get().cuedMedia || queue.getCurrent();
            }
            // if no media to play, stop player and bail
            if (!media) {
              get().stop();
              return;
            }
            await options.onBeforePlay?.();
            await get().providerApi?.play();
          },
          pause: () => {
            get().providerApi?.pause();
          },
          stop: () => {
            if (!get().isPlaying) return;
            get().pause();
            get().seek(0);
          },
          playNext: async () => {
            get().stop();
            let media = queue.getCurrent();

            if (get().repeat === 'all' && queue.isLast()) {
              media = queue.getFirst();
            } else if (get().repeat !== 'one') {
              media = queue.getNext();
            }

            if (media) {
              await get().play(media);
            } else {
              get().seek(0);
              get().play();
            }
          },
          playPrevious: async () => {
            get().stop();
            let media = queue.getCurrent();

            if (get().repeat === 'all' && queue.getPointer() === 0) {
              media = queue.getLast();
            } else if (get().repeat !== 'one') {
              media = queue.getPrevious();
            }

            if (media) {
              await get().play(media);
            } else {
              get().seek(0);
              get().play();
            }
          },
          cue: async media => {
            if (isSameMedia(media, get().cuedMedia)) return;

            return new Promise((resolve, reject) => {
              const previousProvider = get().providerName;

              // wait until media is cued on provider or 3 seconds
              const timeoutId = setTimeout(() => {
                unsubscribe();
                resolve();
              }, 3000);
              const unsubscribe = get().subscribe({
                cued: () => {
                  clearTimeout(timeoutId);
                  unsubscribe();
                  resolve();
                },
                error: () => {
                  clearTimeout(timeoutId);
                  unsubscribe();
                  reject();
                },
              });

              set({
                cuedMedia: media,
                posterUrl: media.poster,
                providerName: media.provider,
                providerReady: previousProvider === media.provider,
                streamType: 'streamType' in media ? media.streamType : null,
              });

              if (media) {
                options.setMediaSessionMetadata?.(media);
              }

              setInLocalStorage('cuedMediaId', media.id);
            });
          },
          async overrideQueue(
            mediaItems: MediaItem[],
            queuePointer: number = 0
          ): Promise<any> {
            if (!mediaItems?.length) return;
            const items = [...mediaItems];
            set(s => {
              s.shuffledQueue = get().shuffling
                ? shuffleArray(items, true)
                : items;
              s.originalQueue = items;
            });
            setInLocalStorage('queue', get().originalQueue.slice(0, 15));
            const media =
              queuePointer > -1 ? mediaItems[queuePointer] : queue.getCurrent();
            if (media) {
              return get().cue(media);
            }
          },
          appendToQueue: (mediaItems, afterCuedMedia = true) => {
            const shuffledNewItems = get().shuffling
              ? shuffleArray([...mediaItems])
              : [...mediaItems];
            const index = afterCuedMedia ? queue.getPointer() : 0;
            set(s => {
              s.shuffledQueue = prependToArrayAtIndex(
                s.shuffledQueue,
                shuffledNewItems,
                index
              );
              s.originalQueue = prependToArrayAtIndex(
                s.originalQueue,
                mediaItems,
                index
              );
            });
            setInLocalStorage('queue', get().originalQueue.slice(0, 15));
          },
          removeFromQueue: mediaItems => {
            set(s => {
              s.shuffledQueue = s.shuffledQueue.filter(
                item => !mediaItems.find(m => isSameMedia(m, item))
              );
              s.originalQueue = s.originalQueue.filter(
                item => !mediaItems.find(m => isSameMedia(m, item))
              );
            });
            setInLocalStorage('queue', get().originalQueue.slice(0, 15));
          },
          textTracks: [],
          currentTextTrack: -1,
          setCurrentTextTrack: trackId => {
            get().providerApi?.setCurrentTextTrack?.(trackId);
          },
          textTrackIsVisible: false,
          setTextTrackVisibility: isVisible => {
            get().providerApi?.setTextTrackVisibility?.(isVisible);
          },
          destroy: () => {
            get().exitFullscreen();
            get().exitPip();
            options?.onDestroy?.();
            resetMediaSession();
            listeners.clear();
            document.removeEventListener('keydown', keybindsHandler);
          },
          init: async () => {
            // add initial and listeners from options, these will be present for the entire lifetime of the player
            listeners.add(internalListeners);
            if (options.listeners) {
              listeners.add(options.listeners as Partial<ProviderListeners>);
            }

            const mediaId =
              initialData.cuedMediaId || initialData.queue?.[0]?.id;
            const mediaToCue = initialData.queue?.find(
              media => media.id === mediaId
            );
            if (mediaToCue) {
              await get().cue(mediaToCue);
            }
            initPlayerMediaSession(get, options);
            document.addEventListener('keydown', keybindsHandler);
          },
          subscribe: newListeners => {
            listeners.add(newListeners);
            return () => listeners.delete(newListeners);
          },
          emit(event, payload?: any) {
            listeners.forEach(l => l[event]?.({state: get(), ...payload}));
          },
        };
      })
    )
  );
};
