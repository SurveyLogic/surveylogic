import React, {Ref, useCallback, useId, useMemo, useRef, useState} from 'react';
import {useControlledState} from '@react-stately/utils';
import {
  buildListboxCollection,
  CollectionItem,
} from './build-listbox-collection';
import {useFloatingPosition} from '../../overlays/floating-position';
import {
  ListBoxChildren,
  ListboxProps,
  PrimitiveValue,
  UseListboxReturn,
} from './types';
import {VirtualElement} from '@floating-ui/react-dom';

export function useListbox<T>(
  props: ListboxProps & ListBoxChildren<T>,
  ref?: Ref<HTMLElement>
): UseListboxReturn {
  const {
    children,
    items,
    role = 'listbox',
    virtualFocus,
    loopFocus = false,
    onItemSelected,
    clearInputOnItemSelection,
    blurReferenceOnItemSelection,
    floatingWidth = 'matchTrigger',
    floatingMinWidth,
    floatingMaxHeight,
    offset,
    placement,
    showCheckmark,
    showEmptyMessage,
    maxItems,
    isAsync,
  } = props;
  const selectionMode = props.selectionMode || 'none';
  const id = useId();
  const listboxId = `${id}-listbox`;

  // controlled state for text input (if in combobox mode)
  const [inputValue, setInputValue] = useControlledState(
    props.inputValue,
    props.defaultInputValue || '',
    props.onInputValueChange
  );

  // mostly for combobox, so can show all collection items on dropdown icon click, even if user has filtered via input
  const [activeCollection, setActiveCollection] = useState<'all' | 'filtered'>(
    'all'
  );

  const collections = buildListboxCollection({
    children,
    items,
    inputValue,
    maxItems,
  });
  const collection =
    activeCollection === 'all'
      ? collections.collection
      : collections.filteredCollection;

  // items for keyboard navigation
  const listItemsRef = useRef<Array<HTMLElement | null>>([]);

  // plain text labels for typeahead
  const listContent: (string | null)[] = useMemo(() => {
    return [...collection.values()].map(o =>
      o.isDisabled ? null : o.textLabel
    );
  }, [collection]);

  // state for currently selected values (always array, even in single selection mode)
  const {selectedValues, selectValues} = useControlledSelection(props);

  const [isOpen, setIsOpen] = useControlledState(
    props.isOpen,
    props.defaultIsOpen,
    props.onOpenChange
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // handle listbox positioning relative to trigger
  const floatingProps = useFloatingPosition({
    floatingWidth,
    ref,
    placement,
    offset,
    maxHeight: floatingMaxHeight ?? 420,
    // don't shift floating menu on the sides of combobox, otherwise input might get obscured
    shiftCrossAxis: !virtualFocus,
  });
  const {refs, floating, strategy, x, y} = floatingProps;

  // handle selection state for syncing with active index in keyboard navigation
  const selectedOption =
    selectionMode === 'none' ? undefined : collection.get(selectedValues[0]);
  const selectedIndex =
    selectionMode === 'none' ? undefined : selectedOption?.index;
  const setSelectedIndex = (index: number) => {
    if (selectionMode !== 'none') {
      const item = [...collection.values()][index];
      if (item) {
        selectValues(item.value);
      }
    }
  };

  // focus and scroll to specified index, in both virtual and regular mode.
  // will also skip disabled indices and focus next or previous non-disabled index instead
  const focusItem = useCallback(
    (fallbackOperation: 'increment' | 'decrement', newIndex: number) => {
      const items = [...collection.values()];
      const allItemsDisabled = !items.find(i => !i.isDisabled);
      const lastIndex = collection.size - 1;

      // invalid index
      if (
        newIndex == null ||
        !collection.size ||
        newIndex > lastIndex ||
        newIndex < 0 ||
        allItemsDisabled
      ) {
        setActiveIndex(null);
        return;
      }

      // get next or previous non-disabled item
      newIndex = getNonDisabledIndex(
        items,
        newIndex,
        loopFocus,
        fallbackOperation
      );

      setActiveIndex(newIndex);

      if (virtualFocus) {
        listItemsRef.current[newIndex]?.scrollIntoView({
          block: 'nearest',
        });
      } else {
        listItemsRef.current[newIndex]?.focus();
      }
    },
    [collection, virtualFocus, loopFocus]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);

      // if listbox is async, filtering will happen on backend
      if (!isAsync) {
        setActiveCollection(e.target.value.trim() ? 'filtered' : 'all');
      }

      if (e.target.value) {
        setIsOpen(true);
      } else {
        // deselect currently selected option if user fully clears the input
        selectValues('');
      }
    },
    [setInputValue, setIsOpen, setActiveCollection, selectValues, isAsync]
  );

  const handleItemSelection = (value: PrimitiveValue) => {
    const reference = refs.reference.current as
      | HTMLElement
      | VirtualElement
      | null;
    if (selectionMode !== 'none') {
      selectValues(value);
    } else {
      if (reference && 'focus' in reference) {
        reference.focus();
      }
    }
    // is combobox
    if (virtualFocus) {
      setInputValue(clearInputOnItemSelection ? '' : `${value}`);
      if (blurReferenceOnItemSelection && reference && 'blur' in reference) {
        reference.blur();
      }
    }
    setActiveCollection('all');
    setIsOpen(false);
    onItemSelected?.(value);
    // make sure "onItemSelected" callback has a chance to use activeIndex value, before clearing it
    setActiveIndex(null);
  };

  return {
    // even handlers
    handleItemSelection,
    onInputChange,
    loopFocus,

    // config
    floatingWidth,
    floatingMinWidth,
    floatingMaxHeight,
    showCheckmark,
    collection,
    virtualFocus,
    focusItem,
    showEmptyMessage,

    // floating ui
    refs,
    reference: floatingProps.reference,
    floating,
    positionStyle: {
      position: strategy,
      top: y ?? '',
      left: x ?? '',
    },

    listContent,
    listItemsRef,
    listboxId,
    role,

    state: {
      // currently focused or active (if virtual focus) option
      activeIndex,
      setActiveIndex,
      selectedIndex,
      setSelectedIndex,
      selectionMode,
      selectedValues,
      selectValues,
      inputValue,
      setInputValue,
      isOpen,
      setIsOpen,
      setActiveCollection,
    },
  };
}

function getNonDisabledIndex(
  items: CollectionItem<unknown>[],
  newIndex: number,
  loopFocus: boolean,
  operation: 'increment' | 'decrement'
) {
  const lastIndex = items.length - 1;
  while (items[newIndex]?.isDisabled) {
    if (operation === 'increment') {
      newIndex++;
      if (newIndex >= lastIndex) {
        // loop from the start, if end reached
        if (loopFocus) {
          newIndex = 0;
          // if focus is not looping, stay on the previous index
        } else {
          return newIndex - 1;
        }
      }
    } else {
      newIndex--;
      // loop from the end, if start reached
      if (newIndex < 0) {
        if (loopFocus) {
          newIndex = lastIndex;
          // if focus is not looping, stay on the previous index
        } else {
          return newIndex + 1;
        }
      }
    }
  }

  return newIndex;
}

function useControlledSelection(props: ListboxProps) {
  const {selectionMode, allowEmptySelection} = props;
  const selectionEnabled =
    selectionMode === 'single' || selectionMode === 'multiple';

  const [stateValues, setStateValues] = useControlledState<any>(
    !selectionEnabled ? undefined : props.selectedValue,
    !selectionEnabled ? undefined : props.defaultSelectedValue,
    !selectionEnabled ? undefined : props.onSelectionChange
  );

  const selectedValues = useMemo(() => {
    if (stateValues == null) {
      return [];
    }
    return Array.isArray(stateValues) ? stateValues : [stateValues];
  }, [stateValues]);

  const selectValues = useCallback(
    (mixedValue: PrimitiveValue | PrimitiveValue[] | null) => {
      const newValues = Array.isArray(mixedValue) ? mixedValue : [mixedValue];
      if (selectionMode === 'single') {
        setStateValues(newValues[0]);
      } else {
        newValues.forEach(newValue => {
          const index = selectedValues.indexOf(newValue);
          if (index === -1) {
            selectedValues.push(newValue);
            setStateValues([...selectedValues]);
          } else if (selectedValues.length > 1 || allowEmptySelection) {
            selectedValues.splice(index, 1);
            setStateValues([...selectedValues]);
          }
        });
      }
    },
    [allowEmptySelection, selectedValues, selectionMode, setStateValues]
  );

  return {
    selectedValues,
    selectValues,
  };
}
