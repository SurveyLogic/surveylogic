import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useContext, useEffect, useRef} from 'react';
import {PlayerStoreContext} from '@common/player/player-context';
import {useHtmlMediaInternalState} from '@common/player/providers/html-media/use-html-media-internal-state';
import {useHtmlMediaEvents} from '@common/player/providers/html-media/use-html-media-events';
import {useHtmlMediaApi} from '@common/player/providers/html-media/use-html-media-api';

export function HtmlVideoProvider() {
  const ref = useRef<HTMLVideoElement>(null);

  const cuedMedia = usePlayerStore(s => s.cuedMedia);
  const store = useContext(PlayerStoreContext);

  const state = useHtmlMediaInternalState(ref);
  const events = useHtmlMediaEvents(state);
  const providerApi = useHtmlMediaApi(state);

  useEffect(() => {
    store.setState({
      providerApi,
    });
  }, [store, providerApi]);

  return (
    <video
      className="w-full h-full"
      ref={ref}
      src={cuedMedia?.src}
      playsInline
      poster={cuedMedia?.poster}
      {...events}
    />
  );
}
