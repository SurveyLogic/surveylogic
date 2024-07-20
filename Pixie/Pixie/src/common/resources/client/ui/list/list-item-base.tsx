import clsx from 'clsx';
import React, {
  ComponentPropsWithRef,
  JSXElementConstructor,
  ReactNode,
} from 'react';
import {CheckIcon} from '../../icons/material/Check';
import {To} from 'react-router-dom';

export interface ListItemBaseProps extends ComponentPropsWithRef<'div'> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  endSection?: ReactNode;
  description?: ReactNode;
  textLabel?: string;
  capitalizeFirst?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  className?: string;
  showCheckmark?: boolean;
  elementType?: 'a' | JSXElementConstructor<any> | 'div';
  to?: To;
  href?: string;
}

export const ListItemBase = React.forwardRef<HTMLDivElement, ListItemBaseProps>(
  (props, ref) => {
    let {
      startIcon,
      capitalizeFirst,
      children,
      description,
      endIcon,
      endSection,
      isDisabled,
      isActive,
      isSelected,
      showCheckmark,
      elementType = 'div',
      ...domProps
    } = props;

    if (!startIcon && showCheckmark) {
      startIcon = (
        <CheckIcon
          size="sm"
          className={clsx('text-primary', !isSelected && 'invisible')}
        />
      );
    }

    const iconClassName = clsx(
      'icon-sm rounded overflow-hidden flex-shrink-0',
      !isDisabled && 'text-muted'
    );
    const endSectionClassName = clsx(!isDisabled && 'text-muted');

    const Element = elementType;

    return (
      <Element
        {...domProps}
        aria-disabled={isDisabled}
        className={itemClassName(props)}
        ref={ref}
      >
        {startIcon && <div className={iconClassName}>{startIcon}</div>}
        <div
          className={clsx(
            'mr-auto w-full',
            capitalizeFirst && 'first-letter:capitalize'
          )}
        >
          {children}
          {description && (
            <div
              className={clsx(
                'text-xs mt-4 whitespace-normal',
                isDisabled ? 'text-disabled' : 'text-muted'
              )}
            >
              {description}
            </div>
          )}
        </div>
        {(endIcon || endSection) && (
          <div className={endIcon ? iconClassName : endSectionClassName}>
            {endIcon || endSection}
          </div>
        )}
      </Element>
    );
  }
);

interface Props {
  isSelected?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  className?: string;
  showCheckmark?: boolean;
}
function itemClassName({
  className,
  isSelected,
  isActive,
  isDisabled,
  showCheckmark,
}: Props): string {
  let state: string = '';
  if (isDisabled) {
    state = 'text-disabled pointer-events-none';
  } else if (isSelected) {
    if (isActive) {
      state = 'bg-primary/focus';
    } else {
      state = 'bg-primary/selected hover:bg-primary/focus';
    }
  } else if (isActive) {
    state = 'hover:bg-fg-base/15 bg-focus';
  } else {
    state = 'hover:bg-hover';
  }

  return clsx(
    'w-full select-none outline-none cursor-pointer',
    'py-8 text-sm truncate flex items-center gap-10',
    !isDisabled && 'text-main',
    showCheckmark ? 'px-8' : 'px-20',
    state,
    className
  );
}
