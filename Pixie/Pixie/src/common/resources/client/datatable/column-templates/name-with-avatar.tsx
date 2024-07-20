import React, {ReactNode} from 'react';
import {Avatar, AvatarProps} from '../../ui/images/avatar';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import clsx from 'clsx';

interface Props {
  image?: string;
  label: ReactNode;
  description?: ReactNode;
  labelClassName?: string;
  avatarSize?: AvatarProps['size'];
}
export function NameWithAvatar({
  image,
  label,
  description,
  labelClassName,
  avatarSize = 'md',
}: Props) {
  return (
    <div className="flex items-center gap-12">
      {image && (
        <Avatar size={avatarSize} className="flex-shrink-0" src={image} />
      )}
      <div className="overflow-hidden min-w-0">
        <div
          className={clsx(labelClassName, 'overflow-hidden overflow-ellipsis')}
        >
          {label}
        </div>
        {description && (
          <div className="text-muted text-xs overflow-hidden overflow-ellipsis">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function NameWithAvatarPlaceholder({
  labelClassName,
  showDescription,
}: Partial<Props> & {
  showDescription?: boolean;
}) {
  return (
    <div className="flex items-center gap-12 w-full max-w-4/5">
      <Skeleton size="w-32 h-32" />
      <div className="flex-auto">
        <div className={clsx(labelClassName, 'leading-3')}>
          <Skeleton />
        </div>
        {showDescription && (
          <div className="text-muted leading-3 mt-4">{<Skeleton />}</div>
        )}
      </div>
    </div>
  );
}
