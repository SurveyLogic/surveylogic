import {m} from 'framer-motion';
import clsx from 'clsx';
import React from 'react';
import {useStore} from '../../state/store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {state, tools} from '../../state/utils';
import {CloseIcon} from '@common/icons/material/Close';
import {Button} from '@common/ui/buttons/button';
import {OBJ_DISPLAY_NAMES, ObjectName} from '../object-name';
import {PopoverAnimation} from '@common/ui/overlays/popover-animation';
import {Trans} from '@common/i18n/trans';

export function ObjListPanel() {
  const objects = useStore(s => s.objects.all);
  const activeId = useStore(s => s.objects.active.id);

  return (
    <m.div
      {...PopoverAnimation}
      className={`absolute bottom-20 right-20 w-224 max-w-[calc(100%-40px)] max-h-[calc(100%-40px)] bg-paper shadow-xl border focus:outline-none rounded overflow-hidden`}
    >
      <div className="px-10 py-2 mb-4 font-medium text-sm border-b flex items-center">
        <Trans message="Objects" />
        <IconButton
          size="xs"
          className="ml-auto flex-shrink-0"
          onClick={() => {
            state().togglePanel('objects', false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-8">
        {objects.map(obj => {
          const isActive = obj.id === activeId;
          const objName = obj.name as Exclude<
            ObjectName,
            ObjectName.StraightenAnchor
          >;
          const displayName = OBJ_DISPLAY_NAMES[objName];
          const startIcon =
            displayName.icon &&
            React.createElement(displayName.icon, {className: 'icon-sm'});
          return (
            <Button
              onClick={() => {
                if (isActive || !obj.selectable) return;
                tools().objects.select(obj.id);
              }}
              variant="outline"
              color={isActive ? 'primary' : null}
              size="sm"
              className={clsx(
                'w-full mb-8',
                (isActive || !obj.selectable) && 'pointer-events-none'
              )}
              justify="justify-start"
              key={obj.id}
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
