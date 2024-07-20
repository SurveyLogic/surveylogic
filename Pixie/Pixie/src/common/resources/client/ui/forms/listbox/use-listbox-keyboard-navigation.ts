import React from 'react';
import {UseListboxReturn} from './types';

export function useListboxKeyboardNavigation({
  state: {isOpen, setIsOpen, selectedIndex, activeIndex},
  loopFocus,
  collection,
  focusItem,
}: UseListboxReturn) {
  const handleTriggerKeyDown = (e: React.KeyboardEvent): true | void => {
    // ignore if dropdown is open or if event bubbled up from portal
    if (isOpen || !e.currentTarget.contains(e.target as HTMLElement)) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      focusItem('increment', selectedIndex != null ? selectedIndex : 0);
      return true;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      focusItem(
        'decrement',
        selectedIndex != null ? selectedIndex : collection.size - 1
      );
      return true;
    } else if (e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault();
      setIsOpen(true);
      focusItem('increment', selectedIndex != null ? selectedIndex : 0);
      return true;
    }
  };

  const handleListboxKeyboardNavigation = (
    e: React.KeyboardEvent
  ): true | void => {
    const lastIndex = Math.max(0, collection.size - 1);
    // ignore if event bubbled up from portal, or dropdown is closed
    if (!isOpen || !e.currentTarget.contains(e.target as HTMLElement)) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (activeIndex == null) {
          focusItem('increment', 0);
        } else if (activeIndex >= lastIndex) {
          // if focus is not looping, stay on last index
          if (loopFocus) {
            focusItem('increment', 0);
          }
        } else {
          focusItem('increment', activeIndex + 1);
        }
        return true;
      case 'ArrowUp':
        e.preventDefault();
        if (activeIndex == null) {
          focusItem('decrement', lastIndex);
        } else if (activeIndex <= 0) {
          // if focus is not looping, stay on first index
          if (loopFocus) {
            focusItem('decrement', lastIndex);
          }
        } else {
          focusItem('decrement', activeIndex - 1);
        }
        return true;
      case 'Home':
        e.preventDefault();
        focusItem('increment', 0);
        return true;
      case 'End':
        e.preventDefault();
        focusItem('decrement', lastIndex);
        return true;
      case 'Tab':
        setIsOpen(false);
        return true;
    }
  };

  return {handleTriggerKeyDown, handleListboxKeyboardNavigation};
}
