import {HTMLAttributes, HTMLProps, RefObject, useId} from 'react';
import {BaseFieldPropsWithDom} from './base-field-props';
import {useAutoFocus} from '../../focus/use-auto-focus';
import type {FieldProps} from './field';

interface UseFieldReturn<T> {
  fieldProps: Omit<FieldProps, 'fieldClassNames' | 'children'>;
  inputProps: HTMLAttributes<T>;
}

interface Props<T> extends BaseFieldPropsWithDom<T> {
  focusRef: RefObject<HTMLElement>;
}
export function useField<T>(props: Props<T>): UseFieldReturn<T> {
  const {
    focusRef,
    labelElementType = 'label',
    label,
    labelSuffix,
    autoFocus,
    autoSelectText,
    labelPosition,
    descriptionPosition,
    size,
    errorMessage,
    description,
    flexibleHeight,
    startAdornment,
    endAdornment,
    startAppend,
    adornmentPosition,
    endAppend,
    className,
    inputClassName,
    inputWrapperClassName,
    unstyled,
    background,
    invalid,
    disabled,
    id,
    inputRadius,
    inputBorder,
    inputShadow,
    ...inputDomProps
  } = props;

  useAutoFocus(props, focusRef);

  const defaultId = useId();
  const inputId = id || defaultId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const labelProps = {
    id: labelId,
    htmlFor: labelElementType === 'label' ? inputId : undefined,
  };
  const descriptionProps = {
    id: descriptionId,
  };
  const errorMessageProps = {
    id: errorId,
  };

  const ariaLabel =
    !props.label && !props['aria-label'] && props.placeholder
      ? props.placeholder
      : props['aria-label'];

  const inputProps: HTMLProps<T> = {
    'aria-label': ariaLabel,
    'aria-invalid': invalid || undefined,
    id: inputId,
    disabled,
    ...inputDomProps,
  };

  const labelledBy = [];
  if (label) {
    labelledBy.push(labelProps.id);
  }
  if (inputProps['aria-labelledby']) {
    labelledBy.push(inputProps['aria-labelledby']);
  }
  inputProps['aria-labelledby'] = labelledBy.length
    ? labelledBy.join(' ')
    : undefined;

  const describedBy = [];
  if (description) {
    describedBy.push(descriptionProps.id);
  }
  if (errorMessage) {
    describedBy.push(errorMessageProps.id);
  }
  if (inputProps['aria-describedby']) {
    describedBy.push(inputProps['aria-describedby']);
  }
  inputProps['aria-describedby'] = describedBy.length
    ? describedBy.join(' ')
    : undefined;

  return {
    fieldProps: {
      errorMessageProps,
      descriptionProps,
      labelProps,
      disabled,
      label,
      labelSuffix,
      autoFocus,
      autoSelectText,
      labelPosition,
      descriptionPosition,
      size,
      errorMessage,
      description,
      flexibleHeight,
      startAdornment,
      endAdornment,
      startAppend,
      adornmentPosition,
      endAppend,
      className,
      inputClassName,
      inputWrapperClassName,
      unstyled,
      background,
      invalid,
    },
    inputProps,
  };
}
