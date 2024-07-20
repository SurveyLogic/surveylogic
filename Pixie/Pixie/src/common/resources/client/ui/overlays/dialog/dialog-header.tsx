import React, {ReactNode, useContext} from 'react';
import clsx from 'clsx';
import {DialogContext} from './dialog-context';
import {IconButton} from '../../buttons/icon-button';
import {CloseIcon} from '../../../icons/material/Close';
import {DialogSize} from './dialog';
import {ButtonSize} from '@common/ui/buttons/button-size';

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
  color?: string | null;
  onDismiss?: () => void;
  hideDismissButton?: boolean;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  size?: DialogSize;
  padding?: string;
  showDivider?: boolean;
  titleTextSize?: string;
  closeButtonSize?: ButtonSize;
}
export function DialogHeader(props: DialogHeaderProps) {
  const {
    children,
    className,
    color,
    onDismiss,
    leftAdornment,
    rightAdornment,
    hideDismissButton = false,
    size,
    showDivider,
    titleTextSize = size === 'xs' ? 'text-xs' : 'text-sm',
    closeButtonSize = size === 'xs' ? 'xs' : 'sm',
  } = props;
  const {labelId, isDismissable, close} = useContext(DialogContext);

  return (
    <div
      className={clsx(
        className,
        'flex items-center justify-between gap-10 flex-shrink-0',
        showDivider && 'border-b',
        getPadding(props),
        color || 'text-main'
      )}
    >
      {leftAdornment}
      <h3
        id={labelId}
        className={clsx(
          className,
          titleTextSize,
          'font-semibold leading-5 opacity-90'
        )}
      >
        {children}
      </h3>
      {rightAdornment}
      {isDismissable && !hideDismissButton && (
        <IconButton
          aria-label="Dismiss"
          onClick={() => {
            if (onDismiss) {
              onDismiss();
            } else {
              close();
            }
          }}
          size={closeButtonSize}
          className={clsx(
            'text-muted ml-auto -mr-8',
            rightAdornment && 'sr-only'
          )}
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
}

function getPadding({size, padding}: DialogHeaderProps) {
  if (padding) {
    return padding;
  }
  switch (size) {
    case '2xs':
    case 'xs':
      return 'px-14 py-4';
    case 'sm':
      return 'px-18 py-4';
    default:
      return 'px-24 py-6';
  }
}
