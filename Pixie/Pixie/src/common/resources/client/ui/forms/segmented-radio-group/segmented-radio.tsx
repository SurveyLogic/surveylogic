import React, {forwardRef, Ref} from 'react';
import clsx from 'clsx';
import {useObjectRef} from '@react-aria/utils';
import {InputSize} from '../input-field/input-size';
import {useAutoFocus} from '../../focus/use-auto-focus';
import {RadioProps} from '../radio-group/radio';

export interface SegmentedRadioProps extends RadioProps {
  labelRef?: Ref<HTMLLabelElement>;
  isSelected?: boolean;
}
export const SegmentedRadio = forwardRef<HTMLInputElement, SegmentedRadioProps>(
  (props, ref) => {
    const {
      children,
      autoFocus,
      size,
      invalid,
      isFirst,
      labelRef,
      isSelected,
      ...domProps
    } = props;

    const inputRef = useObjectRef(ref);
    useAutoFocus({autoFocus}, inputRef);

    const sizeClassNames = getSizeClassNames(size);

    return (
      <label
        ref={labelRef}
        className={clsx(
          'inline-flex gap-8 select-none items-center whitespace-nowrap align-middle font-medium z-20 cursor-pointer transition-colors relative hover:text-main',
          isSelected ? 'text-main' : 'text-muted',
          !isFirst && '',
          sizeClassNames,
          props.disabled && 'text-disabled pointer-events-none',
          props.invalid && 'text-danger'
        )}
      >
        <input
          type="radio"
          className="appearance-none rounded absolute w-full h-full top-0 left-0 focus-visible:outline pointer-events-none"
          ref={inputRef}
          {...domProps}
        />
        {children && <span>{children}</span>}
      </label>
    );
  }
);

function getSizeClassNames(size?: InputSize): string {
  switch (size) {
    case 'xs':
      return 'px-6 py-3 text-xs';
    case 'sm':
      return 'px-10 py-5 text-sm';
    case 'lg':
      return 'px-16 py-6 text-lg';
    default:
      return 'px-16 py-8 text-sm';
  }
}
