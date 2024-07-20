import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useId,
} from 'react';
import clsx from 'clsx';
import {useController} from 'react-hook-form';
import {Orientation} from '../orientation';
import {RadioProps} from './radio';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';

export interface RadioGroupProps {
  children: ReactNode;
  orientation?: Orientation;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: ReactNode;
  disabled?: boolean;
  name?: string;
  errorMessage?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  required?: boolean;
}
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (props, ref) => {
    const style = getInputFieldClassNames(props);
    const {
      label,
      children,
      size,
      className,
      orientation = 'horizontal',
      disabled,
      required,
      invalid,
      errorMessage,
      description,
    } = props;

    const labelProps = {};
    const id = useId();
    const name = props.name || id;

    return (
      <fieldset
        aria-describedby={description ? `${id}-description` : undefined}
        ref={ref}
        className={clsx('text-left', className)}
      >
        {label && (
          <legend className={style.label} {...labelProps}>
            {label}
          </legend>
        )}
        <div
          className={clsx(
            'flex',
            label ? 'mt-6' : 'mt-0',
            orientation === 'vertical' ? 'flex-col gap-10' : 'flex-row gap-16'
          )}
        >
          {Children.map(children, child => {
            if (isValidElement<RadioProps>(child)) {
              return cloneElement<RadioProps>(child, {
                name,
                size,
                invalid: child.props.invalid || invalid || undefined,
                disabled: child.props.disabled || disabled,
                required: child.props.required || required,
              });
            }
          })}
        </div>
        {description && !errorMessage && (
          <div className={style.description} id={`${id}-description`}>
            {description}
          </div>
        )}
        {errorMessage && <div className={style.error}>{errorMessage}</div>}
      </fieldset>
    );
  }
);

interface FormRadioGroupProps extends RadioGroupProps {
  name: string;
}
export function FormRadioGroup({children, ...props}: FormRadioGroupProps) {
  const {
    fieldState: {error},
  } = useController({
    name: props.name!,
  });
  return (
    <RadioGroup errorMessage={error?.message} {...props}>
      {children}
    </RadioGroup>
  );
}
