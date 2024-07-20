import React from 'react';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {Trans} from '@common/i18n/trans';
import {DeleteSelectedItemsAction} from '@common/datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import playlist from './playlist.svg';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {Link} from 'react-router-dom';
import {ChannelsDatatableColumns} from '@common/admin/channels/channels-datatable-columns';

export function ChannelsDatatablePage() {
  return (
    <DataTablePage
      endpoint="channel"
      title={<Trans message="Channels" />}
      headerContent={<InfoTrigger />}
      columns={ChannelsDatatableColumns}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={playlist}
          title={<Trans message="No channels have been created yet" />}
          filteringTitle={<Trans message="No matching channels" />}
        />
      }
    />
  );
}

function InfoTrigger() {
  return (
    <InfoDialogTrigger
      title={<Trans message="Channels" />}
      body={
        <Trans message="Channels are used to display either all content of specific type or manually selected content. They can be shown as separate page or nested." />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton elementType={Link} to="new">
      <Trans message="Add new channel" />
    </DataTableAddItemButton>
  );
}
