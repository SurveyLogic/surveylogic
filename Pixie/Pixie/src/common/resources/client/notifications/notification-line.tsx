import {MixedImage} from '../ui/images/mixed-image';
import clsx from 'clsx';
import React, {JSXElementConstructor} from 'react';
import {
  DatabaseNotification,
  DatabaseNotificationLine,
} from './database-notification';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';

interface LineProps {
  notification: DatabaseNotification;
  line: DatabaseNotificationLine;
  index: number;
  iconRenderer?: JSXElementConstructor<{icon: string}>;
}

export function Line({notification, line, index, iconRenderer}: LineProps) {
  const isPrimary = line.type === 'primary' || index === 0;
  const Icon = iconRenderer || DefaultIconRenderer;
  const Element = line.action ? 'a' : 'div';

  return (
    <>
      <Element
        key={index}
        className={clsx(
          'flex items-center gap-8',
          line.action && 'hover:underline',
          isPrimary
            ? 'text-sm mnarktext-main whitespace-nowrap'
            : 'text-xs text-muted mt-6'
        )}
        href={line.action?.action}
        title={line.action?.label}
      >
        {line.icon && <Icon icon={line.icon} />}
        <div
          className="overflow-hidden text-ellipsis"
          dangerouslySetInnerHTML={{__html: line.content}}
        />
      </Element>
      {index === 0 && (
        <time className="text-xs text-muted">
          <FormattedRelativeTime date={notification.created_at} />
        </time>
      )}
    </>
  );
}

interface DefaultIconRendererProps {
  icon: string;
}
function DefaultIconRenderer({icon}: DefaultIconRendererProps) {
  return <MixedImage src={icon} />;
}
