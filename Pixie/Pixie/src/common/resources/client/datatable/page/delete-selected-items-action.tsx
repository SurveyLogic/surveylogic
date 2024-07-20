import {Button} from '../../ui/buttons/button';
import {Trans} from '../../i18n/trans';
import {ConfirmationDialog} from '../../ui/overlays/dialog/confirmation-dialog';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import React from 'react';
import {useDeleteSelectedRows} from '../requests/delete-selected-rows';
import {useDataTable} from './data-table-context';

export function DeleteSelectedItemsAction() {
  const deleteSelectedRows = useDeleteSelectedRows();
  const {selectedRows} = useDataTable();

  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          deleteSelectedRows.mutate();
        }
      }}
    >
      <Button
        variant="flat"
        color="danger"
        className="ml-auto"
        disabled={deleteSelectedRows.isLoading}
        data-testid="delete-rows-button"
      >
        <Trans message="Delete" />
      </Button>
      <ConfirmationDialog
        title={
          <Trans
            message="Delete [one 1 item|other :count items]?"
            values={{count: selectedRows.length}}
          />
        }
        body={
          <Trans message="This will permanently remove the items and cannot be undone." />
        }
        confirm={<Trans message="Delete" />}
        isDanger
      />
    </DialogTrigger>
  );
}
