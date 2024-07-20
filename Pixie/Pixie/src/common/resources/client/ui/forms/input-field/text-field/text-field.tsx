import React, {forwardRef, HTMLProps, Ref} from 'react';
import {useController} from 'react-hook-form';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {BaseFieldPropsWithDom} from '../base-field-props';
import {getInputFieldClassNames} from '../get-input-field-class-names';
import {Field} from '../field';
import {useField} from '../use-field';

export interface TextFieldProps
  extends BaseFieldPropsWithDom<HTMLInputElement> {
  rows?: number;
  inputElementType?: 'input' | 'textarea';
  inputRef?: Ref<HTMLInputElement>;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      inputElementType = 'input',
      flexibleHeight,
      inputRef,
      inputTestId,
      ...props
    },
    ref
  ) => {
    const inputObjRef = useObjectRef(inputRef);

    const {fieldProps, inputProps} = useField<HTMLInputElement>({
      ...props,
      focusRef: inputObjRef,
    });

    const isTextArea = inputElementType === 'textarea';
    const ElementType: React.ElementType = isTextArea ? 'textarea' : 'input';
    const inputFieldClassNames = getInputFieldClassNames({
      ...props,
      flexibleHeight: flexibleHeight || inputElementType === 'textarea',
    });

    if (inputElementType === 'textarea' && !props.unstyled) {
      inputFieldClassNames.input = `${inputFieldClassNames.input} py-12`;
    }

    return (
      <Field ref={ref} fieldClassNames={inputFieldClassNames} {...fieldProps}>
        <ElementType
          data-testid={inputTestId}
          ref={inputObjRef}
          {...(inputProps as any)}
          rows={
            isTextArea
              ? (inputProps as HTMLProps<HTMLTextAreaElement>).rows || 4
              : undefined
          }
          className={inputFieldClassNames.input}
        />
      </Field>
    );
  }
);

export interface FormTextFieldProps extends TextFieldProps {
  name: string;
}
export const FormTextField = React.forwardRef<
  HTMLDivElement,
  FormTextFieldProps
>(({name, ...props}, ref) => {
  const {
    field: {onChange, onBlur, value = '', ref: inputRef},
    fieldState: {invalid, error},
  } = useController({
    name,
  });

  const formProps: TextFieldProps = {
    onChange,
    onBlur,
    value: value == null ? '' : value, // avoid issues with "null" value when setting form defaults from backend model
    invalid,
    errorMessage: error?.message,
    inputRef,
    name,
  };

  return <TextField ref={ref} {...mergeProps(formProps, props)} />;
});
