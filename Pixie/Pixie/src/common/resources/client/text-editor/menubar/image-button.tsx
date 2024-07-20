import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {ImageIcon} from '../../icons/material/Image';
import {MenubarButtonProps} from './menubar-button-props';
import {useActiveUpload} from '../../uploads/uploader/use-active-upload';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {Disk} from '../../uploads/types/backend-metadata';

const TwoMB = 2097152;

export function ImageButton({editor, size}: MenubarButtonProps) {
  const {selectAndUploadFile} = useActiveUpload();

  const handleUpload = () => {
    selectAndUploadFile({
      showToastOnRestrictionFail: true,
      restrictions: {
        allowedFileTypes: [UploadInputType.image],
        maxFileSize: TwoMB,
      },
      metadata: {
        diskPrefix: 'page_media',
        disk: Disk.public,
      },
      onSuccess: entry => {
        editor.commands.focus();
        editor.commands.setImage({
          src: entry.url,
        });
      },
    });
  };

  return (
    <IconButton
      size={size}
      radius="rounded"
      onClick={handleUpload}
      className={clsx('flex-shrink-0')}
    >
      <ImageIcon />
    </IconButton>
  );
}
