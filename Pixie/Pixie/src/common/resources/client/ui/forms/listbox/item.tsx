import React from 'react';
import {useListboxContext} from './listbox-context';
import {ListItemBase, ListItemBaseProps} from '../../list/list-item-base';

export interface ListboxItemProps extends ListItemBaseProps {
  value: any;
  textLabel?: string;
  onSelected?: () => void;
  onKeyDown?: any;
  tabIndex?: number;
  className?: string;
  capitalizeFirst?: boolean;
}
export function Item({
  children,
  value,
  startIcon,
  endIcon,
  endSection,
  description,
  capitalizeFirst,
  textLabel,
  isDisabled,
  onSelected,
  onClick,
  ...domProps
}: ListboxItemProps) {
  const {
    collection,
    showCheckmark,
    virtualFocus,
    listboxId,
    role,
    listItemsRef,
    handleItemSelection,
    state: {selectedValues, activeIndex, setActiveIndex},
  } = useListboxContext();
  const isSelected = selectedValues.includes(value);
  const index = collection.get(value)?.index;
  const isActive = activeIndex === index;

  // context value might get out of sync with item due to AnimatePresence
  if (index == null) {
    return null;
  }

  const tabIndex = isActive && !isDisabled ? -1 : 0;

  return (
    <ListItemBase
      {...domProps}
      onFocus={() => {
        if (!virtualFocus) {
          setActiveIndex(index);
        }
      }}
      onPointerEnter={e => {
        setActiveIndex(index);
        if (!virtualFocus) {
          e.currentTarget.focus();
        }
      }}
      onPointerDown={e => {
        if (virtualFocus) {
          e.preventDefault();
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemSelection(value);
          onSelected?.();
        }
      }}
      onClick={e => {
        handleItemSelection(value);
        onSelected?.();
        onClick?.(e);
      }}
      ref={node => (listItemsRef.current[index] = node)}
      id={`${listboxId}-${index}`}
      role={role === 'menu' ? 'menuitem' : 'option'}
      tabIndex={virtualFocus ? undefined : tabIndex}
      aria-selected={isActive && isSelected}
      showCheckmark={showCheckmark}
      isDisabled={isDisabled}
      isActive={isActive}
      isSelected={isSelected}
      startIcon={startIcon}
      description={description}
      endIcon={endIcon}
      endSection={endSection}
      capitalizeFirst={capitalizeFirst}
      data-value={value}
    >
      {children}
    </ListItemBase>
  );
}
