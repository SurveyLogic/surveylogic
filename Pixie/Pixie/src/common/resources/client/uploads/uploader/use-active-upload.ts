import {useCallback, useRef} from 'react';
import {useFileUploadStore} from './file-upload-provider';
import {UploadedFile} from '../uploaded-file';
import {UploadStrategyConfig} from './strategy/upload-strategy';
import {openUploadWindow} from '../utils/open-upload-window';
import {useDeleteFileEntries} from '@common/uploads/requests/delete-file-entries';

interface DeleteEntryProps {
  onSuccess: () => void;
  entryPath?: string;
}

export function useActiveUpload() {
  const deleteFileEntries = useDeleteFileEntries();

  // use ref for setting ID to avoid extra renders, zustand selector
  // will pick up changed selector on first progress event
  const uploadIdRef = useRef<string>();

  const uploadSingle = useFileUploadStore(s => s.uploadSingle);
  const updateFileUpload = useFileUploadStore(s => s.updateFileUpload);
  const activeUpload = useFileUploadStore(s =>
    uploadIdRef.current ? s.fileUploads.get(uploadIdRef.current) : null
  );

  const uploadFile = useCallback(
    (file: File | UploadedFile, config?: UploadStrategyConfig) => {
      uploadIdRef.current = uploadSingle(file, config);
    },
    [uploadSingle]
  );

  const selectAndUploadFile = useCallback(
    async (config?: UploadStrategyConfig) => {
      const files = await openUploadWindow({
        types: config?.restrictions?.allowedFileTypes,
      });
      uploadFile(files[0], config);
      return files[0];
    },
    [uploadFile]
  );

  const deleteEntry = useCallback(
    ({onSuccess, entryPath}: DeleteEntryProps) => {
      const handleSuccess = () => {
        if (activeUpload) {
          updateFileUpload(activeUpload.file.id, {
            ...activeUpload,
            entry: undefined,
          });
        }
        onSuccess();
      };

      if (!entryPath && !activeUpload?.entry?.id) {
        handleSuccess();
        return;
      }

      deleteFileEntries.mutate(
        {
          paths: entryPath ? [entryPath] : undefined,
          entryIds: activeUpload?.entry?.id
            ? [activeUpload?.entry?.id]
            : undefined,
          deleteForever: true,
        },
        {onSuccess: handleSuccess}
      );
    },
    [deleteFileEntries, activeUpload, updateFileUpload]
  );

  return {
    uploadFile,
    selectAndUploadFile,
    percentage: activeUpload?.percentage || 0,
    uploadStatus: activeUpload?.status,
    entry: activeUpload?.entry,
    deleteEntry,
    isDeletingEntry: deleteFileEntries.isLoading,
    activeUpload,
  };
}
