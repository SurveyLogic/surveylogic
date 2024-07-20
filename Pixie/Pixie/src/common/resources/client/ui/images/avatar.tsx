import clsx from 'clsx';
import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
} from 'react';
import {Link} from 'react-router-dom';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {AvatarPlaceholderIcon} from '@common/auth/ui/account-settings/avatar/avatar-placeholder-icon';

type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface AvatarProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  src?: string;
  label?: string;
  circle?: boolean;
  size?: Size;
  link?: string;
  fallback?: 'initials' | 'generic';
}
export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className,
      circle,
      size = 'md',
      src,
      link,
      label,
      fallback = 'generic',
      ...domProps
    },
    ref
  ) => {
    let renderedAvatar = src ? (
      <img
        ref={ref}
        src={src}
        alt={label}
        className="block object-cover w-full h-full flex-shrink-0"
      />
    ) : (
      <div className="bg-alt dark:bg-chip w-full h-full">
        <AvatarPlaceholderIcon
          viewBox="0 0 48 48"
          className="w-full h-full text-muted"
        />
      </div>
    );

    if (label) {
      renderedAvatar = <Tooltip label={label}>{renderedAvatar}</Tooltip>;
    }

    const wrapperProps: ComponentProps<any> = {
      ...domProps,
      className: clsx(
        className,
        'relative block overflow-hidden select-none',
        getSizeClassName(size),
        circle ? 'rounded-full' : 'rounded'
      ),
    };

    return link ? (
      <Link {...wrapperProps} to={link}>
        {renderedAvatar}
      </Link>
    ) : (
      <div {...wrapperProps}>{renderedAvatar}</div>
    );
  }
);

function getSizeClassName(size: Size) {
  switch (size) {
    case 'xs':
      return 'w-18 h-18';
    case 'sm':
      return 'w-24 h-24';
    case 'md':
      return 'w-32 h-32';
    case 'lg':
      return 'w-40 h-40';
    // allow overriding with custom classNames
    default:
      return size;
  }
}
