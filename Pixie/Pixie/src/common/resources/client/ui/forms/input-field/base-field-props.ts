import React, {ElementType, HTMLProps, ReactElement, ReactNode} from 'react';
import {InputSize} from './input-size';

export interface BaseFieldProps {
  disabled?: boolean;
  required?: boolean;
  labelSuffix?: ReactNode;
  autoFocus?: boolean;
  autoSelectText?: boolean;
  labelElementType?: ElementType;
  label?: ReactNode;
  labelPosition?: 'top' | 'side';
  labelDisplay?: string;
  size?: InputSize;
  inputRadius?: 'rounded-full' | 'rounded';
  inputBorder?: string;
  inputShadow?: string;
  invalid?: boolean;
  errorMessage?: ReactNode;
  description?: ReactNode;
  descriptionPosition?: 'top' | 'bottom';
  flexibleHeight?: boolean;
  // usually an icon or icon button, displayed inside the input
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  adornmentPosition?: string;
  // usually a text button, displayed side by side with input
  startAppend?: ReactElement;
  endAppend?: ReactElement;
  className?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  unstyled?: boolean;
  background?: 'bg-transparent' | 'bg-alt' | 'bg-paper' | 'bg-white';
  inputTestId?: string;
}

export interface BaseFieldPropsWithDom<T>
  extends BaseFieldProps,
    Omit<HTMLProps<T>, 'label' | 'size' | 'ref' | 'children'> {}
