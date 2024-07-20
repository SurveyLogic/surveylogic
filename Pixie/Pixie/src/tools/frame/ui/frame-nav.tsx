import {useEffect} from 'react';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import {useStore} from '../../../state/store';
import {state, tools} from '../../../state/utils';
import {assetUrl} from '../../../utils/asset-url';
import {CancelIcon} from '@common/icons/material/Cancel';

export function FrameNav() {
  const frames = useStore(s => s.config.tools?.frame?.items) || [];
  const activeFrame = useStore(s => s.frame.active);

  // open options' panel if not open already
  useEffect(() => {
    if (state().frame.active) {
      state().frame.showOptionsPanel();
    }
  }, []);

  const frameItems = frames.map(frame => {
    const src = assetUrl(`images/frames/${frame.name}/thumbnail.png`);
    const isActive = activeFrame?.name === frame.name;
    const activeClass = isActive ? 'border-primary' : '';
    return (
      <ScrollableViewItem key={frame.name}>
        <button
          type="button"
          className={`border-2 overflow-hidden relative rounded border cursor-pointer ${activeClass}`}
          onClick={() => {
            state().setDirty(true);
            if (isActive) {
              tools().frame.remove();
            } else {
              tools().frame.add(frame.name);
            }
          }}
        >
          {isActive && <ActiveOverlay />}
          <img
            draggable="false"
            className="w-64 h-64"
            src={src}
            alt={frame.name}
          />
        </button>
      </ScrollableViewItem>
    );
  });
  return <ScrollableView>{frameItems}</ScrollableView>;
}

function ActiveOverlay() {
  return (
    <span className="bg-background/70 absolute inset-0 text-primary">
      <CancelIcon className="svg-icon icon-md absolute inset-0 block m-auto" />
    </span>
  );
}
