import React, {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  ComponentType,
  forwardRef,
  useCallback,
  useEffect,
} from 'react';
import clsx from 'clsx';
import {useController} from 'react-hook-form';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {useControlledState} from '@react-stately/utils';
import {InputSize} from '../input-field/input-size';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';
import {CheckBoxOutlineBlankIcon} from '@common/icons/material/CheckBoxOutlineBlank';
import {CheckboxFilledIcon} from './checkbox-filled-icon';
import {IndeterminateCheckboxFilledIcon} from './indeterminate-checkbox-filled-icon';
import {SvgIconProps} from '@common/icons/svg-icon';
import {Orientation} from '../orientation';
import {AutoFocusProps, useAutoFocus} from '../../focus/use-auto-focus';

export interface CheckboxProps
  extends AutoFocusProps,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  size?: InputSize;
  className?: string;
  icon?: React.ComponentType;
  checkedIcon?: React.ComponentType;
  orientation?: Orientation;
  errorMessage?: string;
  isIndeterminate?: boolean;
  invalid?: boolean;
  inputTestId?: string;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {
      size = 'md',
      children,
      className,
      icon,
      checkedIcon,
      disabled,
      isIndeterminate,
      errorMessage,
      invalid,
      orientation = 'horizontal',
      onChange,
      autoFocus,
      required,
      value,
      name,
      inputTestId,
    } = props;

    const style = getInputFieldClassNames({...props, label: children});
    const Icon = icon || CheckBoxOutlineBlankIcon;
    const CheckedIcon =
      checkedIcon ||
      (isIndeterminate ? IndeterminateCheckboxFilledIcon : CheckboxFilledIcon);

    const inputObjRef = useObjectRef(ref);
    useAutoFocus({autoFocus}, inputObjRef);

    useEffect(() => {
      // indeterminate is a property, but it can only be set via javascript
      if (inputObjRef.current) {
        inputObjRef.current.indeterminate = isIndeterminate || false;
      }
    });

    const [isSelected, setSelected] = useControlledState(
      props.checked,
      props.defaultChecked || false
    );

    const updateChecked: ChangeEventHandler<HTMLInputElement> = useCallback(
      e => {
        onChange?.(e);
        setSelected(e.target.checked);
      },
      [onChange, setSelected]
    );

    const mergedClassName = clsx(
      'select-none',
      className,
      invalid && 'text-danger',
      !invalid && disabled && 'text-disabled'
    );

    let CheckboxIcon: ComponentType<SvgIconProps>;
    let checkboxColor = invalid ? 'text-danger' : null;
    if (isIndeterminate) {
      CheckboxIcon = IndeterminateCheckboxFilledIcon;
      checkboxColor = checkboxColor || 'text-primary';
    } else if (isSelected) {
      CheckboxIcon = CheckedIcon;
      checkboxColor = checkboxColor || 'text-primary';
    } else {
      CheckboxIcon = Icon;
      checkboxColor = checkboxColor || 'text-muted';
    }

    // input and icon sizes need to match, as checkbox input is being clicked and not the icon due to pointer-events-none
    return (
      <div>
        <label className={mergedClassName}>
          <div
            className={clsx(
              'relative flex items-center',
              orientation === 'vertical' && 'flex-col flex-col-reverse'
            )}
          >
            <input
              className="focus-visible:ring ring-inset transition-shadow outline-none absolute left-0 top-0 w-24 h-24 rounded appearance-none"
              type="checkbox"
              aria-checked={isIndeterminate ? 'mixed' : isSelected}
              aria-invalid={invalid || undefined}
              onChange={updateChecked}
              ref={inputObjRef}
              required={required}
              disabled={disabled}
              value={value}
              name={name}
              data-testid={inputTestId}
            />
            <CheckboxIcon
              size={size}
              className={clsx(
                'pointer-events-none',
                disabled ? 'text-disabled' : checkboxColor
              )}
            />
            {children && (
              <div
                className={clsx(
                  'first-letter:capitalize',
                  style.size.font,
                  orientation === 'vertical' ? 'mb-6' : 'ml-6'
                )}
              >
                {children}
              </div>
            )}
          </div>
        </label>
        {errorMessage && <div className={style.error}>{errorMessage}</div>}
      </div>
    );
  }
);

interface FormCheckboxProps extends CheckboxProps {
  name: string;
}
export function FormCheckbox(props: FormCheckboxProps) {
  const {
    field: {onChange, onBlur, value = false, ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<CheckboxProps> = {
    onChange,
    onBlur,
    checked: value,
    invalid,
    errorMessage: error?.message,
    name: props.name,
  };

  return <Checkbox ref={ref} {...mergeProps(formProps, props)} />;
}
