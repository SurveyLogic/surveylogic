import React, {ReactElement} from 'react';
import clsx from 'clsx';
import {ButtonSize, getButtonSizeStyle} from './button-size';
import {ButtonBase, ButtonBaseProps} from './button-base';
import {IconSize} from '../../icons/svg-icon';

export interface ButtonProps extends ButtonBaseProps {
  size?: ButtonSize;
  equalWidth?: boolean;
  startIcon?: ReactElement | null | false;
  endIcon?: ReactElement | null | false;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      startIcon,
      endIcon,
      size = 'sm',
      className,
      equalWidth = false,
      radius = 'rounded',
      variant = 'text',
      ...other
    },
    ref
  ) => {
    const mergedClassName = clsx(
      'font-semibold',
      getButtonSizeStyle(size, {equalWidth, variant}),
      className
    );
    return (
      <ButtonBase
        className={mergedClassName}
        ref={ref}
        radius={radius}
        variant={variant}
        {...other}
      >
        {startIcon && (
          <InlineIcon position="start" icon={startIcon} size={size} />
        )}
        {children}
        {endIcon && <InlineIcon position="end" icon={endIcon} size={size} />}
      </ButtonBase>
    );
  }
);

type InlineIconProps = {
  icon: ReactElement;
  position: 'start' | 'end';
  size?: IconSize | null;
};
function InlineIcon({icon, position, size}: InlineIconProps): ReactElement {
  const className = clsx(
    'm-auto',
    {
      '-ml-4 mr-8': position === 'start',
      '-mr-4 ml-8': position === 'end',
    },
    icon.props.className
  );
  return React.cloneElement(icon, {className, size});
}
