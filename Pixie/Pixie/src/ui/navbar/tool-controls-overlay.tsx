import {AnimatePresence, m} from 'framer-motion';
import {FilterControls} from '@app/tools/filter/ui/filter-controls';
import {useStore} from '@app/state/store';
import {ActiveFrameControls} from '@app/tools/frame/ui/active-frame-controls';
import {ActiveTextControls} from '@app/tools/text/ui/active-text-controls';
import {ActiveObjectControls} from '@app/objects/ui/active-obj-controls/active-object-controls';
import {ActiveToolOverlay} from '@app/state/editor-state';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ArrowDownwardIcon} from '@common/icons/material/ArrowDownward';
import {useState} from 'react';
import clsx from 'clsx';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';

export function ToolControlsOverlay() {
  const activeOverlay = useStore(s => s.activeToolOverlay);
  const activeObjId = useStore(s => s.objects.active.id);
  const overlayCmp = getOverlay(activeOverlay, activeObjId);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative z-tool-overlay text-sm">
      {overlayCmp && (
        <div
          className={clsx(
            'absolute right-16 text-muted z-50 transition-all',
            !isExpanded && 'rotate-180',
            isExpanded ? '-top-144' : '-top-40'
          )}
        >
          <Tooltip
            label={
              isExpanded ? (
                <Trans message="Hide options" />
              ) : (
                <Trans message="Show options" />
              )
            }
          >
            <IconButton
              variant="outline"
              radius="rounded-lg"
              size="xs"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <AnimatePresence>
        {overlayCmp && isExpanded && (
          <m.div
            initial={{y: 0, opacity: 0}}
            animate={{y: '-100%', opacity: 1}}
            exit={{y: 0, opacity: 0}}
            transition={{type: 'tween', duration: 0.15}}
            key="tool-controls-overlay"
            className="absolute inset-x-0 gap-16 px-5vw bg bg-opacity-95 border-t"
          >
            {overlayCmp}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getOverlay(
  activeOverlay: ActiveToolOverlay | null,
  activeObjId: string | null
) {
  switch (activeOverlay) {
    case ActiveToolOverlay.Filter:
      return <FilterControls />;
    case ActiveToolOverlay.Frame:
      return <ActiveFrameControls />;
    case ActiveToolOverlay.Text:
      return activeObjId && <ActiveTextControls />;
    case ActiveToolOverlay.ActiveObject:
      return activeObjId && <ActiveObjectControls />;
    default:
      return null;
  }
}
