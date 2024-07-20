import {IconButton} from '../../ui/buttons/icon-button';
import {FileDownloadIcon} from '../../icons/material/FileDownload';
import React, {Fragment, useState} from 'react';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {ExportCsvPayload, useExportCsv} from '../requests/use-export-csv';
import {downloadFileFromUrl} from '../../uploads/utils/download-file-from-url';
import {CsvExportInfoDialog} from './csv-export-info-dialog';

interface DataTableExportCsvButtonProps {
  endpoint: string;
  payload?: ExportCsvPayload;
}
export function DataTableExportCsvButton({
  endpoint,
  payload,
}: DataTableExportCsvButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const exportCsv = useExportCsv(endpoint);

  return (
    <Fragment>
      <IconButton
        variant="outline"
        color="primary"
        radius="rounded"
        size="sm"
        className="flex-shrink-0"
        disabled={exportCsv.isLoading}
        onClick={() => {
          exportCsv.mutate(payload, {
            onSuccess: response => {
              if (response.downloadPath) {
                downloadFileFromUrl(response.downloadPath);
              } else {
                setDialogIsOpen(true);
              }
            },
          });
        }}
      >
        <FileDownloadIcon />
      </IconButton>
      <DialogTrigger
        type="modal"
        isOpen={dialogIsOpen}
        onOpenChange={setDialogIsOpen}
      >
        <CsvExportInfoDialog />
      </DialogTrigger>
    </Fragment>
  );
}
