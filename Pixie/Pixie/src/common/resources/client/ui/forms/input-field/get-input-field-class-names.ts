import clsx from 'clsx';
import {BaseFieldProps} from './base-field-props';
import {ButtonSize, getButtonSizeStyle} from '../../buttons/button-size';

export interface InputFieldStyle {
  label: string;
  input: string;
  wrapper: string;
  inputWrapper: string;
  adornment: string;
  append: {size: string; radius: string};
  size: {font: string; height: string};
  description: string;
  error: string;
}

type InputFieldStyleProps = Omit<
  BaseFieldProps,
  'value' | 'defaultValue' | 'onChange'
>;

export function getInputFieldClassNames(
  props: InputFieldStyleProps = {}
): InputFieldStyle {
  const {
    size = 'md',
    startAppend,
    endAppend,
    className,
    labelPosition,
    labelDisplay = 'block',
    inputClassName,
    inputWrapperClassName,
    unstyled,
    invalid,
    disabled,
    background = 'bg-transparent',
    flexibleHeight,
    inputShadow = 'shadow-sm',
    descriptionPosition = 'bottom',
  } = {...props};

  if (unstyled) {
    return {
      label: '',
      input: inputClassName || '',
      wrapper: className || '',
      inputWrapper: inputWrapperClassName || '',
      adornment: '',
      append: {size: '', radius: ''},
      size: {font: '', height: ''},
      description: '',
      error: '',
    };
  }

  const sizeClass = inputSizeClass({
    size: props.size,
    flexibleHeight,
  });
  const isInputGroup = startAppend || endAppend;
  const ringColor = invalid
    ? 'focus:ring-danger/focus focus:border-danger/60'
    : 'focus:ring-primary/focus focus:border-primary/60';

  const radius = getRadius(props);

  return {
    label: clsx(
      labelDisplay,
      'first-letter:capitalize text-left whitespace-nowrap',
      disabled && 'text-disabled',
      sizeClass.font,
      labelPosition === 'side' ? 'mr-16' : 'mb-4'
    ),
    input: clsx(
      'block text-left relative w-full appearance-none transition-shadow text',
      background,

      // radius
      radius.input,

      getInputBorder(props),
      !disabled && `focus:ring ${ringColor} focus:outline-none ${inputShadow}`,
      disabled && 'text-disabled cursor-not-allowed',
      inputClassName,
      sizeClass.font,
      sizeClass.height,
      getInputPadding(props)
    ),
    adornment: iconSizeClass(size),
    append: {
      size: getButtonSizeStyle(size),
      radius: radius.append,
    },
    wrapper: clsx(className, sizeClass.font, {
      'flex items-center': labelPosition === 'side',
    }),
    inputWrapper: clsx(
      'isolate relative',
      inputWrapperClassName,
      isInputGroup && 'flex items-stretch'
    ),
    size: sizeClass,
    description: `text-muted ${
      descriptionPosition === 'bottom' ? 'pt-10' : 'pb-10'
    } text-xs`,
    error: 'text-danger pt-10 text-xs',
  };
}

function getInputBorder({
  startAppend,
  endAppend,
  inputBorder,
  invalid,
}: InputFieldStyleProps) {
  if (inputBorder) return inputBorder;

  const isInputGroup = startAppend || endAppend;
  const borderColor = invalid ? 'border-danger' : 'border-divider';

  if (!isInputGroup) {
    return `${borderColor} border`;
  }
  if (startAppend) {
    return `${borderColor} border-y border-r`;
  }
  return `${borderColor} border-y border-l`;
}

function getInputPadding({
  startAdornment,
  endAdornment,
  inputRadius,
}: InputFieldStyleProps) {
  if (inputRadius === 'rounded-full') {
    return clsx(
      startAdornment ? 'pl-54' : 'pl-28',
      endAdornment ? 'pr-54' : 'pr-28'
    );
  }
  return clsx(
    startAdornment ? 'pl-46' : 'pl-12',
    endAdornment ? 'pr-46' : 'pr-12'
  );
}

function getRadius(props: InputFieldStyleProps): {
  input: string;
  append: string;
} {
  const {startAppend, endAppend, inputRadius} = props;
  const isInputGroup = startAppend || endAppend;

  if (inputRadius === 'rounded-full') {
    return {
      input: clsx(
        !isInputGroup && 'rounded-full',
        startAppend && 'rounded-r-full rounded-l-none',
        endAppend && 'rounded-l-full rounded-r-none'
      ),
      append: startAppend ? 'rounded-l-full' : 'rounded-r-full',
    };
  }
  return {
    input: clsx(
      !isInputGroup && 'rounded',
      startAppend && 'rounded-r rounded-l-none',
      endAppend && 'rounded-l rounded-r-none'
    ),
    append: startAppend ? 'rounded-l' : 'rounded-r',
  };
}

function inputSizeClass({size, flexibleHeight}: BaseFieldProps) {
  switch (size) {
    case '2xs':
      return {font: 'text-xs', height: flexibleHeight ? 'min-h-24' : 'h-24'};
    case 'xs':
      return {font: 'text-xs', height: flexibleHeight ? 'min-h-30' : 'h-30'};
    case 'sm':
      return {font: 'text-sm', height: flexibleHeight ? 'min-h-36' : 'h-36'};
    case 'lg':
      return {
        font: 'text-md md:text-lg',
        height: flexibleHeight ? 'min-h-50' : 'h-50',
      };
    case 'xl':
      return {font: 'text-xl', height: flexibleHeight ? 'min-h-60' : 'h-60'};
    default:
      return {font: 'text-sm', height: flexibleHeight ? 'min-h-42' : 'h-42'};
  }
}

function iconSizeClass(size?: ButtonSize): string {
  switch (size) {
    case '2xs':
      return 'icon-2xs';
    case 'xs':
      return 'icon-xs';
    case 'sm':
      return 'icon-sm';
    case 'md':
      return 'icon-sm';
    case 'lg':
      return 'icon-lg';
    case 'xl':
      return 'icon-xl';
    default:
      // can't return "size" variable here, append in field will not work with it
      return '';
  }
}
