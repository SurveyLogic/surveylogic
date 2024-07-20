import React, {
  HTMLAttributes,
  Key,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useFocusManager} from '@react-aria/focus';
import clsx from 'clsx';
import {mergeProps, useLayoutEffect, useObjectRef} from '@react-aria/utils';
import {useControlledState} from '@react-stately/utils';
import {ChipList} from './chip-list';
import {Field} from '../field';
import {Input} from '../input';
import {Chip, ChipProps} from './chip';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {getInputFieldClassNames} from '../get-input-field-class-names';
import {ProgressCircle} from '../../../progress/progress-circle';
import {useField} from '../use-field';
import {Avatar} from '../../../images/avatar';
import {Listbox} from '../../listbox/listbox';
import {useListbox} from '../../listbox/use-listbox';
import {BaseFieldPropsWithDom} from '../base-field-props';
import {useListboxKeyboardNavigation} from '../../listbox/use-listbox-keyboard-navigation';
import {createEventHandler} from '@common/utils/dom/create-event-handler';
import {ListBoxChildren, ListboxProps} from '../../listbox/types';
import {stringToChipValue} from './string-to-chip-value';
import {Popover} from '../../../overlays/popover';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';

export interface ChipValue extends Omit<NormalizedModel, 'model_type'> {
  invalid?: boolean;
  errorMessage?: string;
}

export type ChipFieldProps<T> = Omit<
  ListboxProps,
  'selectionMode' | 'displayWith'
> &
  Omit<
    BaseFieldPropsWithDom<HTMLInputElement>,
    'value' | 'onChange' | 'defaultValue'
  > & {
    value?: (ChipValue | string)[];
    defaultValue?: (ChipValue | string)[];
    displayWith?: (value: ChipValue) => ReactNode;
    validateWith?: (value: ChipValue) => ChipValue;
    allowCustomValue?: boolean;
    showDropdownArrow?: boolean;
    onChange?: (value: ChipValue[]) => void;
    suggestions?: T[];
    children?: ListBoxChildren<T>['children'];
    placeholder?: string;
    chipSize?: ChipProps['size'];
    openMenuOnFocus?: boolean;
    valueKey?: 'id' | 'name';
    onChipClick?: (value: ChipValue) => void;
  };

function ChipFieldInner<T>(
  props: ChipFieldProps<T>,
  ref: Ref<HTMLInputElement>
) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useObjectRef(ref);
  const {
    displayWith = v => v.name,
    validateWith,
    children,
    suggestions,
    isLoading,
    inputValue,
    onInputValueChange,
    onItemSelected,
    placeholder,
    onOpenChange,
    chipSize = 'md',
    openMenuOnFocus = true,
    showEmptyMessage,
    value: propsValue,
    defaultValue,
    onChange: propsOnChange,
    valueKey,
    isAsync,
    allowCustomValue = true,
    showDropdownArrow,
    onChipClick,
    ...inputFieldProps
  } = props;
  const fieldClassNames = getInputFieldClassNames({
    ...props,
    flexibleHeight: true,
  });

  const [value, onChange] = useChipFieldValueState(props);

  const [listboxIsOpen, setListboxIsOpen] = useState(false);

  const loadingIndicator = (
    <ProgressCircle isIndeterminate size="sm" aria-label="loading..." />
  );

  const dropdownArrow = showDropdownArrow ? <KeyboardArrowDownIcon /> : null;

  const {fieldProps, inputProps} = useField({
    ...inputFieldProps,
    focusRef: inputRef,
    endAdornment: isLoading && listboxIsOpen ? loadingIndicator : dropdownArrow,
  });

  return (
    <Field fieldClassNames={fieldClassNames} {...fieldProps}>
      <Input
        ref={fieldRef}
        className={clsx('flex items-center flex-wrap', fieldClassNames.input)}
        onClick={() => {
          // refocus input when clicking outside it, but while still inside chip field
          inputRef.current?.focus();
        }}
      >
        <ListWrapper
          displayChipUsing={displayWith}
          onChipClick={onChipClick}
          items={value}
          setItems={onChange}
          chipSize={chipSize}
        />
        <ChipInput
          showEmptyMessage={showEmptyMessage}
          inputProps={inputProps}
          inputValue={inputValue}
          onInputValueChange={onInputValueChange}
          fieldRef={fieldRef}
          inputRef={inputRef}
          chips={value}
          setChips={onChange}
          validateWith={validateWith}
          isLoading={isLoading}
          suggestions={suggestions}
          placeholder={placeholder}
          openMenuOnFocus={openMenuOnFocus}
          listboxIsOpen={listboxIsOpen}
          setListboxIsOpen={setListboxIsOpen}
          allowCustomValue={allowCustomValue}
        >
          {children}
        </ChipInput>
      </Input>
    </Field>
  );
}

interface ListWrapperProps {
  items: ChipValue[];
  setItems: (items: ChipValue[]) => void;
  displayChipUsing: (value: ChipValue) => ReactNode;
  chipSize?: ChipProps['size'];
  onChipClick?: (value: ChipValue) => void;
}
function ListWrapper({
  items,
  setItems,
  displayChipUsing,
  chipSize,
  onChipClick,
}: ListWrapperProps) {
  const manager = useFocusManager();
  const removeItem = useCallback(
    (key: Key) => {
      const i = items.findIndex(cr => cr.id === key);
      const newItems = [...items];
      if (i > -1) {
        newItems.splice(i, 1);
        setItems(newItems);
      }
      return newItems;
    },
    [items, setItems]
  );

  return (
    <ChipList
      className="flex-shrink-0 flex-wrap max-w-full my-8"
      size={chipSize}
      selectable
    >
      {items.map(item => (
        <Chip
          key={item.id}
          errorMessage={item.errorMessage}
          adornment={item.image ? <Avatar circle src={item.image} /> : null}
          onClick={() => onChipClick?.(item)}
          onRemove={() => {
            const newItems = removeItem(item.id);
            if (newItems.length) {
              // focus previous chip
              manager.focusPrevious({tabbable: true});
            } else {
              // focus input
              manager.focusLast();
            }
          }}
        >
          {displayChipUsing(item)}
        </Chip>
      ))}
    </ChipList>
  );
}

interface ChipInputProps<T> {
  showEmptyMessage?: boolean;
  inputProps: ReturnType<typeof useField>['inputProps'];
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  fieldRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  chips: ChipValue[];
  setChips: (items: ChipValue[]) => void;
  validateWith?: (value: ChipValue) => ChipValue;
  isLoading?: boolean;
  suggestions?: T[];
  placeholder?: string;
  openMenuOnFocus?: boolean;
  listboxIsOpen: boolean;
  setListboxIsOpen: (value: boolean) => void;
  allowCustomValue: boolean;
  children: ListBoxChildren<T>['children'];
}
function ChipInput<T>(props: ChipInputProps<T>) {
  const {
    inputRef,
    fieldRef,
    validateWith,
    setChips,
    chips,
    suggestions,
    inputProps,
    placeholder,
    openMenuOnFocus,
    listboxIsOpen,
    setListboxIsOpen,
    allowCustomValue,
  } = props;
  const inputClassName = 'outline-none text-sm mx-8 my-4 h-30 flex-auto';
  const manager = useFocusManager();

  const addItems = useCallback(
    (items?: ChipValue[]) => {
      items = (items || []).filter(item => {
        const invalid = !item || !item.id || !item.name;
        const alreadyExists = chips.findIndex(cr => cr.id === item?.id) > -1;
        return !alreadyExists && !invalid;
      });
      if (!items.length) return;

      if (validateWith) {
        items = items.map(item => validateWith(item));
      }
      setChips([...chips, ...items]);
    },
    [chips, setChips, validateWith]
  );

  const listbox = useListbox<T>({
    ...props,
    clearInputOnItemSelection: true,
    isOpen: listboxIsOpen,
    onOpenChange: setListboxIsOpen,
    items: suggestions,
    selectionMode: 'none',
    role: 'listbox',
    virtualFocus: true,
    onItemSelected: value => {
      handleItemSelection(value as string);
    },
  });

  const {
    state: {
      activeIndex,
      setActiveIndex,
      isOpen,
      setIsOpen,
      inputValue,
      setInputValue,
    },
    refs,
    listboxId,
    collection,
    onInputChange,
  } = listbox;

  const handleItemSelection = (textValue: string) => {
    const option =
      collection.size && activeIndex != null
        ? [...collection.values()][activeIndex]
        : null;
    if (option?.item) {
      addItems([option.item]);
    } else if (allowCustomValue) {
      addItems([stringToChipValue(option ? option.value : textValue)]);
    }

    setInputValue('');
    setActiveIndex(null);
    setIsOpen(false);
  };

  // position dropdown relative to whole chip field, not the input
  useLayoutEffect(() => {
    if (fieldRef.current && refs.reference.current !== fieldRef.current) {
      listbox.reference(fieldRef.current);
    }
  }, [fieldRef, listbox, refs]);

  const {handleTriggerKeyDown, handleListboxKeyboardNavigation} =
    useListboxKeyboardNavigation(listbox);

  const handleFocusAndClick = createEventHandler(() => {
    if (openMenuOnFocus && !isOpen) {
      setIsOpen(true);
    }
  });

  return (
    <Listbox
      listbox={listbox}
      mobileOverlay={Popover}
      onPointerDown={e => {
        // prevent focus from leaving input when scrolling listbox via mouse
        e.preventDefault();
      }}
    >
      <input
        type="text"
        className={clsx(inputClassName, 'bg-transparent')}
        placeholder={placeholder}
        {...mergeProps(inputProps, {
          ref: inputRef,
          value: inputValue,
          onChange: onInputChange,
          onPaste: e => {
            const paste = e.clipboardData.getData('text');
            const emails = paste.match(
              /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
            );
            if (emails) {
              e.preventDefault();
              const selection = window.getSelection();
              if (selection?.rangeCount) {
                selection.deleteFromDocument();
                addItems(emails.map(email => stringToChipValue(email)));
              }
            }
          },
          'aria-autocomplete': 'list',
          'aria-controls': isOpen ? listboxId : undefined,
          autoComplete: 'off',
          autoCorrect: 'off',
          spellCheck: 'false',
          onKeyDown: e => {
            const input = e.target as HTMLInputElement;

            if (e.key === 'Enter') {
              // prevent form submitting
              e.preventDefault();
              // add chip from selected listbox option or current input text value
              handleItemSelection(input.value);
              return;
            }

            // on escape, clear input and close dropdown
            if (e.key === 'Escape' && isOpen) {
              setIsOpen(false);
              setInputValue('');
            }

            // move focus to input when focus is on first item and prevent arrow up from cycling listbox
            if (
              e.key === 'ArrowUp' &&
              isOpen &&
              (activeIndex === 0 || activeIndex == null)
            ) {
              setActiveIndex(null);
              return;
            }

            // block left and right arrows from navigating in input, if focus is on listbox
            if (
              activeIndex != null &&
              (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            ) {
              e.preventDefault();
              return;
            }

            // move focus on the last chip, if focus is at the  start of input
            if (
              (e.key === 'ArrowLeft' ||
                e.key === 'Backspace' ||
                e.key === 'Delete') &&
              input.selectionStart === 0 &&
              activeIndex == null &&
              chips.length
            ) {
              manager.focusPrevious({tabbable: true});
              return;
            }

            // fallthrough to listbox navigation handlers for arrow keys
            const handled = handleTriggerKeyDown(e);
            if (!handled) {
              handleListboxKeyboardNavigation(e);
            }
          },
          onFocus: handleFocusAndClick,
          onClick: handleFocusAndClick,
        } as HTMLAttributes<HTMLInputElement>)}
      />
    </Listbox>
  );
}

function useChipFieldValueState({
  onChange,
  value,
  defaultValue,
  valueKey,
}: ChipFieldProps<any>) {
  // convert value from string[] to ChipValue[], if needed
  const propsValue = useMemo(() => {
    return mixedValueToChipValue(value);
  }, [value]);

  // convert defaultValue from string[] to ChipValue[], if needed
  const propsDefaultValue = useMemo(() => {
    return mixedValueToChipValue(defaultValue);
  }, [defaultValue]);

  // emit string[] or ChipValue[] on change, based on "valueKey" prop
  const handleChange = useCallback(
    (value: ChipValue[]) => {
      const newValue = valueKey ? value.map(v => v[valueKey]) : value;
      onChange?.(newValue as any);
    },
    [onChange, valueKey]
  );

  return useControlledState<ChipValue[]>(
    !propsValue ? undefined : propsValue,
    propsDefaultValue || [],
    handleChange
  );
}

function mixedValueToChipValue(
  value?: (string | number | ChipValue)[] | null
): ChipValue[] | undefined {
  if (value == null) {
    return undefined;
  }

  return value.map(v => {
    return typeof v !== 'object' ? stringToChipValue(v as string) : v;
  });
}

export const ChipField = React.forwardRef(ChipFieldInner) as <T>(
  props: ChipFieldProps<T> & {ref?: Ref<HTMLInputElement>}
) => ReactElement;
