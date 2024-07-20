import React from 'react';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';
import {BaseFieldProps} from '../input-field/base-field-props';

interface Props
  extends BaseFieldProps,
    Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> {}
export function NativeSelect(props: Props) {
  const style = getInputFieldClassNames(props);
  const {label, id, children, size, ...other} = {...props};
  return (
    <div className={style.wrapper}>
      {label && (
        <label className={style.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className={style.input} {...other}>
        {children}
      </select>
    </div>
  );
}
