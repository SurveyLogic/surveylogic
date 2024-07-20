import React, {ComponentPropsWithoutRef, forwardRef, Ref} from 'react';
import type {TextFieldProps} from './text-field';
import {Field} from '../field';
import {getInputFieldClassNames} from '../get-input-field-class-names';

interface Props extends TextFieldProps {
  labelProps?: ComponentPropsWithoutRef<'label'>;
  inputProps:
    | ComponentPropsWithoutRef<'input'>
    | ComponentPropsWithoutRef<'textarea'>;
  descriptionProps?: ComponentPropsWithoutRef<'div'>;
  errorMessageProps?: ComponentPropsWithoutRef<'div'>;
  inputRef?: Ref<HTMLInputElement>;
  isLoading?: boolean;
  rows?: number;
}

export const TextFieldBase = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    label,
    startAdornment,
    endAdornment,
    startAppend,
    endAppend,
    errorMessage,
    description,
    labelProps,
    inputProps,
    inputRef,
    descriptionProps,
    errorMessageProps,
    inputWrapperClassName,
    className,
    inputClassName,
    disabled,
    inputElementType,
    rows,
  } = props;

  const isTextArea = inputElementType === 'textarea';
  const ElementType: React.ElementType = isTextArea ? 'textarea' : 'input';
  const fieldClassNames = getInputFieldClassNames(props);

  return (
    <Field
      ref={ref}
      label={label}
      labelProps={labelProps}
      startAdornment={startAdornment}
      endAdornment={endAdornment}
      startAppend={startAppend}
      endAppend={endAppend}
      errorMessage={errorMessage}
      description={description}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      inputWrapperClassName={inputWrapperClassName}
      className={className}
      inputClassName={inputClassName}
      fieldClassNames={fieldClassNames}
      disabled={disabled}
    >
      <ElementType
        ref={inputRef as any}
        {...(inputProps as any)}
        rows={isTextArea ? rows || 4 : undefined}
        className={fieldClassNames.input}
      />
    </Field>
  );
});
