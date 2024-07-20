import React, {HTMLAttributes, ReactElement, ReactNode} from 'react';
import clsx from 'clsx';
import {ChevronRightIcon} from '../../icons/material/ChevronRight';
import type {BreadcrumbSizeStyle} from './breadcrumb';

export interface BreadcrumbItemProps {
  sizeStyle?: BreadcrumbSizeStyle;
  isMenuTrigger?: boolean;
  isMenuItem?: boolean;
  children: ReactNode | ((state: {isMenuItem?: boolean}) => ReactNode);
  isCurrent?: boolean;
  onSelected?: () => void;
  isClickable?: boolean;
  isDisabled?: boolean;
  className?: string;
  isLink?: boolean;
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const {
    isCurrent,
    sizeStyle,
    isMenuTrigger,
    isClickable,
    isDisabled,
    onSelected,
    className,
    isMenuItem,
    isLink,
  } = props;

  const children =
    typeof props.children === 'function'
      ? props.children({isMenuItem})
      : props.children;

  if (isMenuItem) {
    return children as ReactElement;
  }

  const domProps: HTMLAttributes<HTMLDivElement> = isMenuTrigger
    ? {}
    : {
        tabIndex: isLink && !isDisabled ? 0 : undefined,
        role: isLink ? 'link' : undefined,
        'aria-disabled': isLink ? isDisabled : undefined,
        'aria-current': isCurrent && isLink ? 'page' : undefined,
        onClick: () => onSelected?.(),
      };

  return (
    <li
      className={clsx(
        `inline-flex justify-start items-center relative min-w-0 ${sizeStyle?.font}`,
        isMenuTrigger && 'flex-shrink-0',
        (!isClickable || isDisabled) && 'pointer-events-none',
        !isCurrent && isDisabled && 'text-disabled'
      )}
    >
      <div
        {...domProps}
        className={clsx(
          className,
          'px-8 cursor-pointer rounded whitespace-nowrap overflow-hidden',
          !isMenuTrigger && 'py-4 hover:bg-hover',
          !isMenuTrigger && isLink && 'focus-visible:ring outline-none'
        )}
      >
        {children}
      </div>
      {isCurrent === false && (
        <ChevronRightIcon
          size={sizeStyle?.icon}
          className={clsx(isDisabled ? 'text-disabled' : 'text-muted')}
        />
      )}
    </li>
  );
}
