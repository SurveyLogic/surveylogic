import {useController} from 'react-hook-form';
import React, {useMemo} from 'react';
import {mergeProps} from '@react-aria/utils';
import {ChipField} from '../../ui/forms/input-field/chip-field/chip-field';
import {FormChipFieldProps} from '../../ui/forms/input-field/chip-field/form-chip-field';

export function JsonChipField({children, ...props}: FormChipFieldProps<any>) {
  const {
    field: {onChange, onBlur, value = [], ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const arrayValue = useMemo(() => {
    const mixedValue = value as string | string[];
    return typeof mixedValue === 'string' ? JSON.parse(mixedValue) : mixedValue;
  }, [value]);

  const formProps: Partial<FormChipFieldProps<any>> = {
    onChange: newValue => {
      const jsonValue = JSON.stringify(newValue.map(chip => chip.name));
      onChange(jsonValue);
    },
    onBlur,
    value: arrayValue,
    invalid,
    errorMessage: error?.message,
  };

  return <ChipField ref={ref} {...mergeProps(formProps, props)} />;
}
