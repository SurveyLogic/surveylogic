import React, {ReactNode} from 'react';
import clsx from 'clsx';
import {InputSize} from '../forms/input-field/input-size';

export interface IllustratedMessageProps {
  className?: string;
  size?: InputSize;
  image?: ReactNode;
  imageHeight?: string;
  imageMargin?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}
export function IllustratedMessage({
  image,
  title,
  description,
  action,
  className,
  size = 'md',
  imageHeight,
  imageMargin = 'mb-24',
}: IllustratedMessageProps) {
  const style = getSizeClassName(size, imageHeight);
  return (
    <div className={clsx('text-center', className)}>
      {image && <div className={clsx(style.image, imageMargin)}>{image}</div>}
      {title && (
        <div className={clsx(style.title, 'text-main mb-2')}>{title}</div>
      )}
      {description && (
        <div className={clsx(style.description, 'text-muted mb-14')}>
          {description}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

function getSizeClassName(size: InputSize, imageHeight?: string) {
  switch (size) {
    case 'xs':
      return {
        image: imageHeight || 'h-60',
        title: 'text-sm',
        description: 'text-xs',
      };
    case 'sm':
      return {
        image: imageHeight || 'h-80',
        title: 'text-base',
        description: 'text-sm',
      };
    default:
      return {
        image: imageHeight || 'h-128',
        title: 'text-lg',
        description: 'text-base',
      };
  }
}
