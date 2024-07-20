import React, {RefObject} from 'react';
import clsx from 'clsx';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {Field} from '../input-field/field';
import {BaseFieldPropsWithDom} from '../input-field/base-field-props';
import {Adornment} from '../input-field/adornment';
import {useListbox} from '../listbox/use-listbox';
import {useField} from '../input-field/use-field';
import {Item} from '../listbox/item';
import {Section} from '../listbox/section';
import {Listbox} from '../listbox/listbox';
import {Trans} from '@common/i18n/trans';
import {useListboxKeyboardNavigation} from '../listbox/use-listbox-keyboard-navigation';
import {useTypeSelect} from '../listbox/use-type-select';
import {ListBoxChildren, ListboxProps} from '../listbox/types';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';

type SelectProps = Omit<BaseFieldPropsWithDom<HTMLButtonElement>, 'value'> &
  ListboxProps &
  ListBoxChildren<string | number> & {
    hideCaret?: boolean;
    selectionMode: 'single';
    minWidth?: string;
  };
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (props, ref) => {
    const {
      hideCaret,
      placeholder = <Trans message="Select an option..." />,
      selectedValue,
      onItemSelected,
      onOpenChange,
      onInputValueChange,
      onSelectionChange,
      selectionMode,
      minWidth = 'min-w-128',
      children,
      ...inputFieldProps
    } = props;

    const isMobile = useIsMobileMediaQuery();
    const listbox = useListbox(
      {
        ...props,
        floatingWidth: isMobile ? 'auto' : 'matchTrigger',
        selectionMode: 'single',
        role: 'listbox',
      },
      ref
    );
    const {
      state: {selectedValues, isOpen, setIsOpen, activeIndex, setSelectedIndex},
      focusItem,
      listboxId,
      reference,
      refs,
      listContent,
    } = listbox;

    const {fieldProps, inputProps} = useField({
      ...inputFieldProps,
      focusRef: refs.reference as RefObject<HTMLButtonElement>,
    });

    const selectedOption = listbox.collection.get(selectedValues[0]);
    const content = selectedOption ? (
      <span className="flex items-center gap-10">
        {selectedOption.element.props.startIcon}
        <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
          {selectedOption.element.props.children}
        </span>
      </span>
    ) : (
      <span className="italic">{placeholder}</span>
    );

    const fieldClassNames = getInputFieldClassNames({
      ...props,
      endAdornment: true,
    });

    const {handleTriggerKeyDown, handleListboxKeyboardNavigation} =
      useListboxKeyboardNavigation(listbox);

    const {findMatchingItem} = useTypeSelect();

    // focus matching item when user types, if dropdown is open
    const handleListboxTypeSelect = (e: React.KeyboardEvent) => {
      if (!isOpen) return;
      const i = findMatchingItem(e, listContent, activeIndex);
      if (i != null) {
        focusItem('increment', i);
      }
    };

    // select matching item when user types, if dropdown is closed
    const handleTriggerTypeSelect = (e: React.KeyboardEvent) => {
      if (isOpen) return undefined;
      const i = findMatchingItem(e, listContent, activeIndex);
      if (i != null) {
        setSelectedIndex(i);
      }
    };

    return (
      <Listbox
        listbox={listbox}
        onKeyDownCapture={handleListboxTypeSelect}
        onKeyDown={handleListboxKeyboardNavigation}
      >
        <Field fieldClassNames={fieldClassNames} {...fieldProps}>
          <button
            {...inputProps}
            type="button"
            data-selected-value={selectedOption?.value}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listboxId : undefined}
            ref={reference}
            onKeyDown={handleTriggerKeyDown}
            onKeyDownCapture={handleTriggerTypeSelect}
            disabled={inputFieldProps.disabled}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={clsx(
              fieldClassNames.input,
              !fieldProps.unstyled && minWidth
            )}
          >
            {content}
            {!hideCaret && (
              <Adornment direction="end">
                <KeyboardArrowDownIcon className={fieldClassNames.adornment} />
              </Adornment>
            )}
          </button>
        </Field>
      </Listbox>
    );
  }
);

export type FormSelectProps = SelectProps & {
  name: string;
};
export function FormSelect({children, ...props}: FormSelectProps) {
  const {
    field: {onChange, onBlur, value = null, ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<SelectProps> = {
    onSelectionChange: onChange,
    onBlur,
    selectedValue: value,
    invalid,
    errorMessage: error?.message,
    name: props.name,
  };

  return (
    <Select ref={ref} {...mergeProps(formProps, props)}>
      {children}
    </Select>
  );
}

export {Item as Option};
export {Section as OptionGroup};
