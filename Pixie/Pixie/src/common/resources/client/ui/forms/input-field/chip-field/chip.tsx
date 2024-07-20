import React, {
  cloneElement,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useRef,
} from 'react';
import clsx from 'clsx';
import {useFocusManager} from '@react-aria/focus';
import {ButtonBase} from '../../../buttons/button-base';
import {CancelFilledIcon} from './cancel-filled-icon';
import {WarningIcon} from '@common/icons/material/Warning';
import {Tooltip} from '../../../tooltip/tooltip';
import {To} from 'react-router-dom';

export interface ChipProps {
  onRemove?: () => void;
  disabled?: boolean;
  selectable?: boolean;
  invalid?: boolean;
  errorMessage?: ReactNode;
  children?: ReactNode;
  className?: string;
  adornment?: null | ReactElement<{
    size: string;
    className?: string;
    circle?: boolean;
  }>;
  radius?: string;
  color?: 'chip' | 'primary' | 'danger' | 'positive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  elementType?: 'div' | 'a' | JSXElementConstructor<any>;
  to?: To;
  onClick?: (e: React.MouseEvent) => void;
}
export function Chip(props: ChipProps) {
  const {
    onRemove,
    disabled,
    invalid,
    errorMessage,
    children,
    className,
    selectable = false,
    radius = 'rounded-full',
    elementType = 'div',
    to,
    onClick,
  } = props;
  const chipRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const focusManager = useFocusManager();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        focusManager.focusNext({tabbable: true});
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        focusManager.focusPrevious({tabbable: true});
        break;
      case 'Backspace':
      case 'Delete':
        if (chipRef.current === document.activeElement) {
          onRemove?.();
        }
        break;
      default:
    }
  };

  const handleClick: React.MouseEventHandler = e => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      chipRef.current!.focus();
    }
  };

  const sizeStyle = sizeClassNames(props);

  let adornment =
    invalid || errorMessage != null ? (
      <WarningIcon className="text-danger" size="sm" />
    ) : (
      props.adornment &&
      cloneElement(props.adornment, {
        size: sizeStyle.adornment.size,
        circle: true,
        className: clsx(props.adornment.props, sizeStyle.adornment.margin),
      })
    );

  if (errorMessage && adornment) {
    adornment = (
      <Tooltip label={errorMessage} variant="danger">
        {adornment}
      </Tooltip>
    );
  }

  const Element = elementType;

  return (
    <Element
      tabIndex={selectable ? 0 : undefined}
      ref={chipRef}
      to={to}
      onKeyDown={selectable ? handleKeyDown : undefined}
      onClick={selectable ? handleClick : undefined}
      className={clsx(
        'flex-shrink-0 flex items-center justify-center gap-10 outline-none relative overflow-hidden whitespace-nowrap',
        'after:absolute after:inset-0 after:pointer-events-none',
        onClick && 'cursor-pointer',
        radius,
        colorClassName(props),
        sizeStyle.chip,
        !disabled &&
          selectable &&
          'focus:after:bg-black/10 hover:after:bg-black/5',
        className
      )}
    >
      {adornment}
      {children}
      {onRemove && (
        <ButtonBase
          ref={deleteButtonRef}
          className={clsx(
            'text-black/30 dark:text-white/50',
            sizeStyle.closeButton
          )}
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          tabIndex={-1}
        >
          <CancelFilledIcon className="block" width="100%" height="100%" />
        </ButtonBase>
      )}
    </Element>
  );
}

function sizeClassNames({size, onRemove}: ChipProps) {
  switch (size) {
    case 'xs':
      return {
        adornment: {size: 'xs', margin: '-ml-3'},
        chip: clsx('pl-8 h-18 text-xs font-medium w-max', !onRemove && 'pr-8'),
        closeButton: 'mr-4 w-14 h-14',
      };
    case 'sm':
      return {
        adornment: {size: 'xs', margin: '-ml-3'},
        chip: clsx('pl-8 h-26 text-xs', !onRemove && 'pr-8'),
        closeButton: 'mr-4 w-18 h-18',
      };
    case 'lg':
      return {
        adornment: {size: 'md', margin: '-ml-12'},
        chip: clsx('pl-18 h-38 text-base', !onRemove && 'pr-18'),
        closeButton: 'mr-6 w-24 h-24',
      };
    default:
      return {
        adornment: {size: 'sm', margin: '-ml-6'},
        chip: clsx('pl-12 h-32 text-sm', !onRemove && 'pr-12'),
        closeButton: 'mr-6 w-22 h-22',
      };
  }
}

function colorClassName({color}: ChipProps): string {
  switch (color) {
    case 'primary':
      return `bg-primary text-on-primary`;
    case 'positive':
      return `bg-positive-lighter text-positive-darker`;
    case 'danger':
      return `bg-danger-lighter text-danger-darker`;
    default:
      return `bg-chip text-main`;
  }
}
