import React, {ReactElement, useEffect} from 'react';
import {useListbox} from '../../forms/listbox/use-listbox';
import {Listbox} from '../../forms/listbox/listbox';
import {Menu} from './menu-trigger';
import {useListboxKeyboardNavigation} from '../../forms/listbox/use-listbox-keyboard-navigation';
import {useTypeSelect} from '../../forms/listbox/use-type-select';
import {ListBoxChildren, ListboxProps} from '../../forms/listbox/types';
import {VirtualElement} from '@floating-ui/react-dom';

const preventContextOnMenu = (e: MouseEvent) => {
  e.preventDefault();
};

type Props = ListboxProps &
  ListBoxChildren<any> & {
    position?: {x: number; y: number} | null;
  };

export function ContextMenu({position, children, ...props}: Props) {
  const listbox = useListbox({
    ...props,
    isOpen: props.isOpen && !!position,
    placement: 'right-start',
    floatingWidth: 'auto',
    offset: {mainAxis: 5, alignmentAxis: 4},
    role: 'menu',
    loopFocus: true,
    children:
      (children as ReactElement)?.type === Menu
        ? (children as ReactElement).props.children
        : children,
  });
  const {
    reference,
    refs,
    state: {isOpen, setIsOpen, activeIndex},
    focusItem,
    listContent,
  } = listbox;

  useEffect(() => {
    if (refs.floating.current) {
      refs.floating.current.addEventListener(
        'contextmenu',
        preventContextOnMenu
      );
      return () => {
        refs.floating.current?.removeEventListener(
          'contextmenu',
          preventContextOnMenu
        );
      };
    }
  }, [refs.floating]);

  useEffect(() => {
    if (position) {
      reference(pointToVirtualElement(position));
      setIsOpen(true);
    }
  }, [position, reference, setIsOpen]);

  const {handleListboxKeyboardNavigation} =
    useListboxKeyboardNavigation(listbox);

  const {findMatchingItem} = useTypeSelect();

  return (
    <Listbox
      listbox={listbox}
      onKeyDownCapture={e => {
        if (!isOpen) return;
        const i = findMatchingItem(e, listContent, activeIndex);
        if (i) {
          focusItem('increment', i);
        }
      }}
      onKeyDown={handleListboxKeyboardNavigation}
    />
  );
}

export function pointToVirtualElement(
  {x, y}: {x: number; y: number},
  contextElement?: Element
): VirtualElement {
  return {
    getBoundingClientRect() {
      return {
        x,
        y,
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      };
    },
    contextElement,
  };
}
