import React, {ReactElement, Ref, useEffect, useRef, useState} from 'react';
import {BaseFieldPropsWithDom} from '../input-field/base-field-props';
import {useListboxContext} from '../listbox/listbox-context';
import {Item} from '../listbox/item';
import {useListbox} from '../listbox/use-listbox';
import {ProgressCircle} from '../../progress/progress-circle';
import {IconButton} from '../../buttons/icon-button';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {TextField} from '../input-field/text-field/text-field';
import {Listbox} from '../listbox/listbox';
import {SvgIconProps} from '@common/icons/svg-icon';
import {useTrans} from '@common/i18n/use-trans';
import {useListboxKeyboardNavigation} from '@common/ui/forms/listbox/use-listbox-keyboard-navigation';
import {createEventHandler} from '@common/utils/dom/create-event-handler';
import {ListBoxChildren, ListboxProps} from '../listbox/types';
import {Popover} from '../../overlays/popover';

export {Item as Option};

export type ComboboxProps<T extends object> = Omit<
  BaseFieldPropsWithDom<HTMLInputElement>,
  'endAdornment'
> &
  ListBoxChildren<T> &
  ListboxProps & {
    selectionMode?: 'single' | 'none';
    allowCustomValue?: boolean;
    isAsync?: boolean;
    isLoading?: boolean;
    openMenuOnFocus?: boolean;
    endAdornmentIcon?: ReactElement<SvgIconProps>;
    useOptionLabelAsInputValue?: boolean;
    hideEndAdornment?: boolean;
  };

function ComboBox<T extends object>(
  props: ComboboxProps<T> & {selectionMode: 'single'},
  ref: Ref<HTMLInputElement>
) {
  const {
    children,
    items,
    isAsync,
    isLoading,
    openMenuOnFocus = true,
    endAdornmentIcon,
    onItemSelected,
    maxItems,
    clearInputOnItemSelection,
    inputValue: userInputValue,
    selectedValue,
    onSelectionChange,
    allowCustomValue = false,
    onInputValueChange,
    defaultInputValue,
    selectionMode = 'single',
    useOptionLabelAsInputValue,
    showEmptyMessage,
    floatingMaxHeight,
    hideEndAdornment = false,
    blurReferenceOnItemSelection,
    isOpen: propsIsOpen,
    onOpenChange: propsOnOpenChange,
    ...textFieldProps
  } = props;

  const listbox = useListbox(
    {
      ...props,
      floatingMaxHeight,
      blurReferenceOnItemSelection,
      selectionMode,
      role: 'listbox',
      virtualFocus: true,
    },
    ref
  );

  const {
    handleItemSelection,
    reference,
    listboxId,
    onInputChange,
    state: {
      isOpen,
      activeIndex,
      setIsOpen,
      inputValue,
      setInputValue,
      selectValues,
      selectedValues,
    },
    collection,
  } = listbox;

  const textLabel = selectedValues[0]
    ? collection.get(selectedValues[0])?.textLabel
    : undefined;

  const {handleTriggerKeyDown, handleListboxKeyboardNavigation} =
    useListboxKeyboardNavigation(listbox);

  const handleFocusAndClick = createEventHandler(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (openMenuOnFocus && !isOpen) {
        setIsOpen(true);
      }
      e.target.select();
    }
  );

  return (
    <Listbox
      listbox={listbox}
      mobileOverlay={Popover}
      onPointerDown={e => {
        // prevent focus from leaving input when scrolling listbox via mouse
        e.preventDefault();
      }}
    >
      <TextField
        inputRef={reference}
        {...textFieldProps}
        endAdornment={
          !hideEndAdornment ? (
            <EndAdornment
              icon={endAdornmentIcon}
              isLoading={isLoading}
              isDisabled={textFieldProps.disabled}
            />
          ) : null
        }
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        onChange={onInputChange}
        value={useOptionLabelAsInputValue && textLabel ? textLabel : inputValue}
        onBlur={e => {
          if (allowCustomValue) {
            selectValues(e.target.value);
          } else if (!clearInputOnItemSelection) {
            const val = selectedValues[0];
            setInputValue(selectValues.length && val != null ? `${val}` : '');
          }
        }}
        onFocus={handleFocusAndClick}
        onClick={handleFocusAndClick}
        onKeyDown={e => {
          if (e.key === 'Enter' && activeIndex != null && collection.size) {
            // prevent form submit when selecting item in combobox via "enter"
            e.preventDefault();
            const [value, obj] = [...collection.entries()][activeIndex];
            if (value) {
              handleItemSelection(value);
              // "onSelected" will not be called for dropdown items, because keydown
              // event will never be triggered for them in "virtualFocus" mode
              obj.element.props.onSelected?.();
            }
            return;
          }

          // on escape, clear input and close dropdown
          if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
            if (!allowCustomValue) {
              setInputValue('');
            }
          }

          const handled = handleTriggerKeyDown(e);
          if (!handled) {
            handleListboxKeyboardNavigation(e);
          }
        }}
      />
    </Listbox>
  );
}

interface EndAdornmentProps {
  isLoading?: boolean;
  icon?: ReactElement<SvgIconProps>;
  isDisabled?: boolean;
}
function EndAdornment({isLoading, icon, isDisabled}: EndAdornmentProps) {
  const timeout = useRef<any>(null);
  const {trans} = useTrans();
  const [showLoading, setShowLoading] = useState(false);

  const {
    state: {setIsOpen, isOpen, inputValue, setActiveCollection},
  } = useListboxContext();

  const lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (isLoading && !showLoading) {
      if (timeout.current === null) {
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }

      // If user is typing, clear the timer and restart since it is a new request
      if (inputValue !== lastInputValue.current) {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }
    } else if (!isLoading) {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    lastInputValue.current = inputValue;
  }, [isLoading, showLoading, inputValue]);

  // loading circle should only be displayed if menu is open, if menuTrigger is "manual", or first time load (to stop circle from showing up when user selects an option)
  const showLoadingIndicator = showLoading && (isOpen || isLoading);

  if (showLoadingIndicator) {
    return (
      <ProgressCircle
        aria-label={trans({message: 'Loading'})}
        size="sm"
        isIndeterminate
      />
    );
  }

  return (
    <IconButton
      radius="rounded"
      size="md"
      tabIndex={-1}
      disabled={isDisabled}
      onPointerDown={e => {
        e.preventDefault();
        e.stopPropagation();
        setActiveCollection('all');
        setIsOpen(!isOpen);
      }}
    >
      {icon || <KeyboardArrowDownIcon />}
    </IconButton>
  );
}

const ComboBoxForwardRef = React.forwardRef(ComboBox) as <T extends object>(
  props: ComboboxProps<T> & {ref?: Ref<HTMLInputElement>}
) => ReactElement;
export {ComboBoxForwardRef as ComboBox};
