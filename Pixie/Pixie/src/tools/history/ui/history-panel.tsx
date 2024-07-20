import React from 'react';
import {m} from 'framer-motion';
import clsx from 'clsx';
import {useStore} from '../../../state/store';
import {Button} from '@common/ui/buttons/button';
import {HISTORY_DISPLAY_NAMES} from '../history-display-names';
import {IconButton} from '@common/ui/buttons/icon-button';
import {state, tools} from '../../../state/utils';
import {CloseIcon} from '@common/icons/material/Close';
import {PopoverAnimation} from '@common/ui/overlays/popover-animation';
import {Trans} from '@common/i18n/trans';

export function HistoryPanel() {
  const items = useStore(s => s.history.items);
  const pointer = useStore(s => s.history.pointer);

  return (
    <m.div
      {...PopoverAnimation}
      className={`absolute bottom-20 right-20 w-224 max-w-[calc(100%-40px)] max-h-[calc(100%-40px)] bg-paper shadow-xl border focus:outline-none rounded overflow-hidden`}
    >
      <div className="px-10 py-2 mb-4 font-medium text-sm border-b flex items-center">
        <Trans message="History" />
        <IconButton
          size="xs"
          className="ml-auto flex-shrink-0"
          onClick={() => {
            state().togglePanel('history', false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-10">
        {items.map(item => {
          const isActive = item.id === items[pointer].id;
          const displayName = HISTORY_DISPLAY_NAMES[item.name];
          const startIcon =
            displayName.icon &&
            React.createElement(displayName.icon, {className: 'icon-sm'});
          return (
            <Button
              onClick={() => {
                if (isActive) return;
                tools().history.load(item);
              }}
              variant="outline"
              color={isActive ? 'primary' : null}
              size="sm"
              className={clsx('w-full mb-8', isActive && 'pointer-events-none')}
              justify="justify-start"
              key={item.id}
              startIcon={startIcon}
            >
              <Trans {...displayName.name} />
            </Button>
          );
        })}
      </div>
    </m.div>
  );
}
