import React, {ReactElement} from 'react';
import type {MenubarItemProps} from './toolbar-item';
import {Menu, MenuTrigger} from '@common/ui/navigation/menu/menu-trigger';
import {state} from '../../../state/utils';
import {Item} from '@common/ui/forms/listbox/item';

interface DropdownButtonProps extends MenubarItemProps {
  button: ReactElement;
}

export function DropdownButton({item, button}: DropdownButtonProps) {
  return (
    <MenuTrigger>
      {button}
      <Menu>
        {(item.menuItems || []).map(item => (
          <Item
            key={item.label}
            value={item.label}
            onSelected={() => {
              item.action(state().editor);
            }}
          >
            {item.label}
          </Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
