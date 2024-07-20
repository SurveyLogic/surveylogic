import React, {Children, Fragment, ReactElement, ReactNode} from 'react';
import {AvatarProps} from '@common/ui/images/avatar';
import clsx from 'clsx';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';

interface AvatarGroupProps {
  children: ReactNode;
  className?: string;
}
export function AvatarGroup(props: AvatarGroupProps) {
  const children = Children.toArray(
    props.children
  ) as ReactElement<AvatarProps>[];

  if (!children.length) return null;

  const firstLink = children[0].props.link;
  const label = children[0].props.label;

  return (
    <div className={clsx('pl-10 flex isolate items-center', props.className)}>
      <Fragment>
        {children.map((avatar, index) => (
          <div
            key={index}
            style={{zIndex: 5 - index}}
            className={clsx(
              'relative border-2 border-bg-alt bg-alt rounded-full -ml-10 overflow-hidden flex-shrink-0'
            )}
          >
            {avatar}
          </div>
        ))}
      </Fragment>
      <div className="text-sm whitespace-nowrap ml-10">
        {firstLink && label ? (
          <Link to={firstLink} className="hover:underline">
            {label}
          </Link>
        ) : null}
        {children.length > 1 && (
          <span>
            {' '}
            <Trans
              message="+ :count more"
              values={{count: children.length - 1}}
            />
          </span>
        )}
      </div>
    </div>
  );
}
