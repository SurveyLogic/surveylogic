import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {ChipField, ChipFieldProps} from './chip-field';

export type FormChipFieldProps<T> = ChipFieldProps<T> & {
  name: string;
};

export function FormChipField<T>({children, ...props}: FormChipFieldProps<T>) {
  const {
    field: {onChange, onBlur, value = [], ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<ChipFieldProps<T>> = {
    onChange,
    onBlur,
    value,
    invalid,
    errorMessage: error?.message,
  };

  return (
    <ChipField ref={ref} {...mergeProps(formProps, props)}>
      {children}
    </ChipField>
  );
}
