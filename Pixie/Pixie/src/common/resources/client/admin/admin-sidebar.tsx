import clsx from 'clsx';
import React from 'react';
import {CustomMenu} from '../menus/custom-menu';
import {Trans} from '../i18n/trans';
import {useSettings} from '../core/settings/use-settings';

interface Props {
  className?: string;
  isCompactMode?: boolean;
}
export function AdminSidebar({className, isCompactMode}: Props) {
  const {version} = useSettings();
  return (
    <div
      className={clsx(
        className,
        'text-sm pt-26 px-12 pb-16 text-muted font-medium bg-alt flex flex-col gap-20 border-r overflow-y-auto relative'
      )}
    >
      <CustomMenu
        matchDescendants={to => to === '/admin'}
        menu="admin-sidebar"
        orientation="vertical"
        onlyShowIcons={isCompactMode}
        itemClassName={({isActive}) =>
          clsx(
            'block w-full rounded py-12 px-16 border-l-4',
            isActive
              ? 'bg-primary/hover border-l-primary'
              : 'border-l-transparent hover:bg-hover'
          )
        }
        gap="gap-8"
      />
      {!isCompactMode && (
        <div className="mt-auto gap-14 px-16 text-xs">
          <Trans message="Version: :number" values={{number: version}} />
        </div>
      )}
    </div>
  );
}
