import {ColumnConfig} from '@common/datatable/column-config';
import {CustomPage} from '@common/admin/custom-pages/custom-page';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@common/ui/buttons/external-link';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {FormattedDate} from '@common/i18n/formatted-date';
import React from 'react';
import {IconButton} from '@common/ui/buttons/icon-button';
import {EditIcon} from '@common/icons/material/Edit';

export const CustomPageDatatableColumns: ColumnConfig<CustomPage>[] = [
  {
    key: 'slug',
    allowsSorting: true,
    width: 'flex-2 min-w-200',
    visibleInMode: 'all',
    header: () => <Trans message="Slug" />,
    body: page => (
      <Link target="_blank" to={`/pages/${page.slug}`} className={LinkStyle}>
        {page.slug}
      </Link>
    ),
  },
  {
    key: 'user_id',
    allowsSorting: true,
    width: 'flex-2 min-w-140',
    header: () => <Trans message="Owner" />,
    body: page =>
      page.user && (
        <NameWithAvatar
          image={page.user.avatar}
          label={page.user.display_name}
          description={page.user.email}
        />
      ),
  },
  {
    key: 'type',
    maxWidth: 'max-w-100',
    header: () => <Trans message="Type" />,
    body: page => <Trans message={page.type} />,
  },
  {
    key: 'updated_at',
    allowsSorting: true,
    width: 'w-100',
    header: () => <Trans message="Last updated" />,
    body: page => <FormattedDate date={page.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-84 flex-shrink-0',
    visibleInMode: 'all',
    body: page => (
      <IconButton
        size="md"
        className="text-muted"
        elementType={Link}
        to={`${page.id}/edit`}
      >
        <EditIcon />
      </IconButton>
    ),
  },
];
