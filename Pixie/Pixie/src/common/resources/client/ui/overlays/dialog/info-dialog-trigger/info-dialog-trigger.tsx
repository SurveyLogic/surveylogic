import {IconButton} from '@common/ui/buttons/icon-button';
import {InfoDialogTriggerIcon} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger-icon';
import {Dialog, DialogSize} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import React, {ReactNode} from 'react';
import clsx from 'clsx';

interface InfoDialogTriggerProps {
  title?: ReactNode;
  body: ReactNode;
  dialogSize?: DialogSize;
  className?: string;
}
export function InfoDialogTrigger({
  title,
  body,
  dialogSize = 'sm',
  className,
}: InfoDialogTriggerProps) {
  return (
    <DialogTrigger type="popover" triggerOnHover>
      <IconButton
        className={clsx('text-muted opacity-70', className)}
        size="xs"
      >
        <InfoDialogTriggerIcon viewBox="0 0 16 16" />
      </IconButton>
      <Dialog size={dialogSize}>
        {title && (
          <DialogHeader padding="px-18 pt-12" size="md" hideDismissButton>
            {title}
          </DialogHeader>
        )}
        <DialogBody>{body}</DialogBody>
      </Dialog>
    </DialogTrigger>
  );
}
