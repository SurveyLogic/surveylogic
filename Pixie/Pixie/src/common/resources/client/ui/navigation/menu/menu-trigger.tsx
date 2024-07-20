import React, {cloneElement, forwardRef, ReactElement, useId} from 'react';
import {useListbox} from '../../forms/listbox/use-listbox';
import {Item} from '../../forms/listbox/item';
import {Section} from '../../forms/listbox/section';
import {Listbox} from '../../forms/listbox/listbox';
import {useListboxKeyboardNavigation} from '../../forms/listbox/use-listbox-keyboard-navigation';
import {createEventHandler} from '../../../utils/dom/create-event-handler';
import {useTypeSelect} from '../../forms/listbox/use-type-select';
import {ListBoxChildren, ListboxProps} from '../../forms/listbox/types';
import {useIsMobileMediaQuery} from '../../../utils/hooks/is-mobile-media-query';

type Props = ListboxProps & {
  children: [ReactElement, ReactElement<ListBoxChildren<string | number>>];
};
export const MenuTrigger = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const {
      children: [menuTrigger, menu],
      floatingWidth = 'auto',
    } = props;

    const id = useId();

    const isMobile = useIsMobileMediaQuery();
    const listbox = useListbox(
      {
        ...props,
        floatingWidth: isMobile ? floatingWidth : 'auto',
        role: 'menu',
        loopFocus: true,
        children: menu.props.children,
      },
      ref
    );

    const {
      state: {isOpen, setIsOpen, activeIndex},
      listboxId,
      focusItem,
      listContent,
      reference,
    } = listbox;

    const {handleTriggerKeyDown, handleListboxKeyboardNavigation} =
      useListboxKeyboardNavigation(listbox);

    const {findMatchingItem} = useTypeSelect();

    return (
      <Listbox
        listbox={listbox}
        aria-labelledby={id}
        onKeyDownCapture={e => {
          if (!isOpen) return;
          const i = findMatchingItem(e, listContent, activeIndex);
          if (i) {
            focusItem('increment', i);
          }
        }}
        onKeyDown={handleListboxKeyboardNavigation}
      >
        {cloneElement(menuTrigger, {
          id,
          'aria-expanded': isOpen ? 'true' : 'false',
          'aria-haspopup': 'menu',
          'aria-controls': isOpen ? listboxId : undefined,
          ref: reference,
          onKeyDown: handleTriggerKeyDown,
          onClick: createEventHandler(e => {
            menuTrigger.props?.onClick?.(e);
            setIsOpen(!isOpen);
          }),
        })}
      </Listbox>
    );
  }
);

export function Menu({children}: ListBoxChildren<string | number>) {
  return children as unknown as ReactElement;
}

export {Item as MenuItem};
export {Section as MenuSection};
