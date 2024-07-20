import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {ComboBox, ComboboxProps} from './combobox';

type FormComboBoxProps<T extends object> = ComboboxProps<T> & {
  name: string;
  selectionMode?: 'single';
};
export function FormComboBox<T extends object>({
  children,
  ...props
}: FormComboBoxProps<T>) {
  const {
    field: {onChange, onBlur, value = '', ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<ComboboxProps<T>> = {
    onSelectionChange: onChange,
    onBlur,
    selectedValue: value,
    defaultInputValue: value,
    invalid,
    errorMessage: error?.message,
  };

  return (
    <ComboBox ref={ref} {...mergeProps(formProps, props)}>
      {children}
    </ComboBox>
  );
}
