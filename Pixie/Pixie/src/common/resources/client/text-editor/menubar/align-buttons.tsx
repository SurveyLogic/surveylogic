import clsx from 'clsx';
import {ComponentType} from 'react';
import {FormatAlignLeftIcon} from '../../icons/material/FormatAlignLeft';
import {FormatAlignCenterIcon} from '../../icons/material/FormatAlignCenter';
import {FormatAlignRightIcon} from '../../icons/material/FormatAlignRight';
import {FormatAlignJustifyIcon} from '../../icons/material/FormatAlignJustify';
import {MenubarButtonProps} from './menubar-button-props';
import {IconButton} from '../../ui/buttons/icon-button';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../ui/navigation/menu/menu-trigger';
import {Trans} from '../../i18n/trans';
import {message} from '../../i18n/message';

const iconMap = {
  left: {
    icon: FormatAlignLeftIcon,
    label: message('Align left'),
  },
  center: {
    icon: FormatAlignCenterIcon,
    label: message('Align center'),
  },
  right: {
    icon: FormatAlignRightIcon,
    label: message('Align right'),
  },
  justify: {
    icon: FormatAlignJustifyIcon,
    label: message('Justify'),
  },
};

export function AlignButtons({editor, size}: MenubarButtonProps) {
  const activeKey = (Object.keys(iconMap).find(key => {
    return editor.isActive({textAlign: key});
  }) || 'left') as keyof typeof iconMap;
  const ActiveIcon: ComponentType = activeKey
    ? iconMap[activeKey].icon
    : iconMap.left.icon;

  return (
    <MenuTrigger
      floatingWidth="auto"
      selectionMode="single"
      selectedValue={activeKey}
      onSelectionChange={key => {
        editor.commands.focus();
        editor.commands.setTextAlign(key as string);
      }}
    >
      <IconButton
        size={size}
        color={activeKey ? 'primary' : null}
        radius="rounded"
        className={clsx('flex-shrink-0')}
      >
        <ActiveIcon />
      </IconButton>
      <Menu>
        {Object.entries(iconMap).map(([name, config]) => {
          const Icon = config.icon;
          return (
            <MenuItem
              key={name}
              value={name}
              startIcon={<Icon size="md" />}
              capitalizeFirst
            >
              <Trans message={config.label.message} />
            </MenuItem>
          );
        })}
      </Menu>
    </MenuTrigger>
  );
}
