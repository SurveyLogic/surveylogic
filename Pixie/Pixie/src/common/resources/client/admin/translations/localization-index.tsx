import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {Localization} from '../../i18n/localization';
import {TranslateIcon} from '../../icons/material/Translate';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {UpdateLocalizationDialog} from './update-localization-dialog';
import {Tooltip} from '../../ui/tooltip/tooltip';
import {CreateLocationDialog} from './create-localization-dialog';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import aroundTheWorldSvg from './around-the-world.svg';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';

const columnConfig: ColumnConfig<Localization>[] = [
  {
    key: 'name',
    allowsSorting: true,
    sortingKey: 'name',
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Name" />,
    body: locale => locale.name,
  },
  {
    key: 'language',
    allowsSorting: true,
    sortingKey: 'language',
    header: () => <Trans message="Language code" />,
    body: locale => locale.language,
  },
  {
    key: 'updatedAt',
    allowsSorting: true,
    width: 'w-100',
    header: () => <Trans message="Last updated" />,
    body: locale => <FormattedDate date={locale.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-84 flex-shrink-0',
    visibleInMode: 'all',
    body: locale => {
      return (
        <div className="text-muted">
          <Link to={`${locale.id}/translate`}>
            <Tooltip label={<Trans message="Translate" />}>
              <IconButton size="md">
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          </Link>
          <DialogTrigger type="modal">
            <Tooltip label={<Trans message="Edit" />}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <UpdateLocalizationDialog localization={locale} />
          </DialogTrigger>
        </div>
      );
    },
  },
];

export function LocalizationIndex() {
  return (
    <DataTablePage
      endpoint="localizations"
      title={<Trans message="Localizations" />}
      columns={columnConfig}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={aroundTheWorldSvg}
          title={<Trans message="No localizations have been created yet" />}
          filteringTitle={<Trans message="No matching localizations" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <Fragment>
      <DialogTrigger type="modal">
        <DataTableAddItemButton>
          <Trans message="Add new localization" />
        </DataTableAddItemButton>
        <CreateLocationDialog />
      </DialogTrigger>
    </Fragment>
  );
}
