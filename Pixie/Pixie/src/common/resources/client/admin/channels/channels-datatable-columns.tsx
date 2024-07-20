import {ColumnConfig} from '@common/datatable/column-config';
import {Trans} from '@common/i18n/trans';
import {FormattedDate} from '@common/i18n/formatted-date';
import {Link} from 'react-router-dom';
import {IconButton} from '@common/ui/buttons/icon-button';
import {EditIcon} from '@common/icons/material/Edit';
import React from 'react';
import {Channel} from '@common/channels/channel';

export const ChannelsDatatableColumns: ColumnConfig<Channel>[] = [
  {
    key: 'name',
    allowsSorting: true,
    width: 'flex-3',
    visibleInMode: 'all',
    header: () => <Trans message="Name" />,
    body: channel => {
      // link will not work without specific genre name in channel url
      if (channel.config.connectToGenreViaUrl) {
        return channel.name;
      }
      return (
        <a
          className="hover:underline focus-visible:underline outline-none"
          href={`channel/${channel.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          {channel.name}
        </a>
      );
    },
  },
  {
    key: 'content_type',
    allowsSorting: false,
    header: () => <Trans message="Content type" />,
    body: channel => (
      <span className="capitalize">
        {channel.config.contentModel ? (
          <Trans message={channel.config.contentModel} />
        ) : undefined}
      </span>
    ),
  },
  {
    key: 'layout',
    allowsSorting: false,
    header: () => <Trans message="Layout" />,
    body: channel => (
      <span className="capitalize">
        {channel.config.layout ? (
          <Trans message={channel.config.layout} />
        ) : undefined}
      </span>
    ),
  },
  {
    key: 'auto_update',
    allowsSorting: false,
    header: () => <Trans message="Auto update" />,
    body: channel => (
      <span className="capitalize">{channel.config.autoUpdateMethod}</span>
    ),
  },
  {
    key: 'updated_at',
    allowsSorting: true,
    maxWidth: 'max-w-100',
    header: () => <Trans message="Last updated" />,
    body: channel =>
      channel.updated_at ? <FormattedDate date={channel.updated_at} /> : '',
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    visibleInMode: 'all',
    align: 'end',
    width: 'w-42 flex-shrink-0',
    body: channel => (
      <Link to={`${channel.id}/edit`} className="text-muted">
        <IconButton size="md">
          <EditIcon />
        </IconButton>
      </Link>
    ),
  },
];
