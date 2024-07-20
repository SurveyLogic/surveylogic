import clsx from 'clsx';
import {forwardRef, ReactNode} from 'react';
import {KeyboardArrowRightIcon} from '../../icons/material/KeyboardArrowRight';
import {ButtonBase, ButtonBaseProps} from '../../ui/buttons/button-base';

interface Props extends ButtonBaseProps {
  startIcon?: ReactNode;
}
export const AppearanceButton = forwardRef<HTMLButtonElement, Props>(
  ({startIcon, children, className, ...other}, ref) => {
    return (
      <ButtonBase
        ref={ref}
        className={clsx(
          'flex items-center gap-10 w-full rounded border text-sm h-54 px-14 mb-10 bg relative hover:bg-hover',
          className
        )}
        variant={null}
        {...other}
      >
        {startIcon}
        <div>{children}</div>
        <KeyboardArrowRightIcon className="icon-sm text-muted ml-auto" />
      </ButtonBase>
    );
  }
);
