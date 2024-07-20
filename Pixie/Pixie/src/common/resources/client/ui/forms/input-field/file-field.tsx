import React, {ChangeEventHandler} from 'react';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {useController} from 'react-hook-form';
import clsx from 'clsx';
import {BaseFieldProps} from './base-field-props';
import {useField} from './use-field';
import {getInputFieldClassNames} from './get-input-field-class-names';
import {Field} from './field';
import {TextFieldProps} from './text-field/text-field';

export interface FileFieldProps
  extends Omit<BaseFieldProps, 'type'> {
  onChange?: ChangeEventHandler<'input'>;
  accept?: string;
}
export const FileField = React.forwardRef<HTMLInputElement, FileFieldProps>(
  (props, ref) => {
    const inputRef = useObjectRef(ref);

    const {fieldProps, inputProps} = useField({...props, focusRef: inputRef});

    const inputFieldClassNames = getInputFieldClassNames(props);

    return (
      <Field ref={ref} fieldClassNames={inputFieldClassNames} {...fieldProps}>
        <input
          type="file"
          ref={inputRef}
          {...inputProps as any}
          className={clsx(
            inputFieldClassNames.input,
            'py-8',
            'file:bg-primary file:text-on-primary file:border-none file:rounded file:text-sm file:font-semibold file:px-10 file:h-24 file:mr-10'
          )}
        />
      </Field>
    );
  }
);

export interface FormFileFieldProps extends FileFieldProps {
  name: string;
}
export function FormFileField({name, ...props}: FormFileFieldProps) {
  const {
    field: {onChange, onBlur, ref},
    fieldState: {invalid, error},
  } = useController({
    name,
  });

  const [value, setValue] = React.useState('');

  const formProps: TextFieldProps = {
    onChange: e => {
      onChange(e.target.files?.[0]);
      setValue(e.target.value);
    },
    onBlur,
    value,
    invalid,
    errorMessage: error?.message,
  };

  return <FileField ref={ref} {...mergeProps(formProps, props)} />;
}
