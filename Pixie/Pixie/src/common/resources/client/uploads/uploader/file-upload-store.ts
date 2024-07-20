import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {enableMapSet} from 'immer';
import {WritableDraft} from 'immer/dist/types/types-external';
import {UploadedFile} from '../uploaded-file';
import {UploadStrategy, UploadStrategyConfig} from './strategy/upload-strategy';
import {MessageDescriptor} from '../../i18n/message-descriptor';
import {FileEntry} from '../file-entry';
import {S3MultipartUpload} from './strategy/s3-multipart-upload';
import {Settings} from '../../core/settings/settings';
import {TusUpload} from './strategy/tus-upload';
import {ProgressTimeout} from './progress-timeout';
import {startUploading} from './start-uploading';
import {createUpload} from './create-file-upload';

enableMapSet();

export interface FileUpload {
  file: UploadedFile;
  percentage: number;
  bytesUploaded: number;
  status: 'pending' | 'inProgress' | 'aborted' | 'failed' | 'completed';
  errorMessage?: string | MessageDescriptor | null;
  entry?: FileEntry;
  request?: UploadStrategy;
  timer?: ProgressTimeout;
  options: UploadStrategyConfig;
  meta?: unknown;
}

export interface FileUploadState {
  concurrency: number;
  fileUploads: Map<string, FileUpload>;
  // uploads with pending and inProgress status
  activeUploadsCount: number;
  completedUploadsCount: number;
  uploadMultiple: (
    files: (File | UploadedFile)[] | FileList,
    options?: Omit<
      UploadStrategyConfig,
      // progress would be called for each upload simultaneously
      'onProgress' | 'showToastOnRestrictionFail'
    >
  ) => string[];
  uploadSingle: (
    file: File | UploadedFile,
    options?: UploadStrategyConfig
  ) => string;
  clearInactive: () => void;
  abortUpload: (id: string) => void;
  updateFileUpload: (id: string, state: Partial<FileUpload>) => void;
  getUpload: (id: string) => FileUpload | undefined;
  runQueue: () => void;
}

interface StoreProps {
  settings: Settings;
}
export const createFileUploadStore = ({settings}: StoreProps) =>
  create<FileUploadState>()(
    immer((set, get) => {
      return {
        concurrency: 3,
        fileUploads: new Map<string, FileUpload>(),
        activeUploadsCount: 0,
        completedUploadsCount: 0,

        getUpload: uploadId => {
          return get().fileUploads.get(uploadId);
        },

        clearInactive: () => {
          set(state => {
            state.fileUploads.forEach((upload, key) => {
              if (upload.status !== 'inProgress') {
                state.fileUploads.delete(key);
              }
            });
          });
          get().runQueue();
        },

        abortUpload: id => {
          const upload = get().fileUploads.get(id);
          if (upload) {
            upload.request?.abort();
            get().updateFileUpload(id, {status: 'aborted', percentage: 0});
            get().runQueue();
          }
        },

        updateFileUpload: (id, newUploadState) => {
          set(state => {
            const fileUpload = state.fileUploads.get(id);
            if (fileUpload) {
              state.fileUploads.set(id, {
                ...fileUpload,
                ...newUploadState,
              });

              // only need to update inProgress count if status of the uploads in queue change
              if ('status' in newUploadState) {
                updateTotals(state);
              }
            }
          });
        },

        uploadSingle: (file, userOptions) => {
          const upload = createUpload(file, userOptions);
          const fileUploads = new Map(get().fileUploads);
          fileUploads.set(upload.file.id, upload);

          set(state => {
            updateTotals(state);
            state.fileUploads = fileUploads;
          });

          get().runQueue();

          return upload.file.id;
        },

        uploadMultiple: (files, options) => {
          // create file upload items from specified files
          const uploads = new Map<string, FileUpload>(get().fileUploads);
          [...files].forEach(file => {
            const upload = createUpload(file, options);
            uploads.set(upload.file.id, upload);
          });

          // set state only once, there might be thousands of files, don't want to trigger a rerender for each one
          set(state => {
            updateTotals(state);
            state.fileUploads = uploads;
          });

          get().runQueue();
          return [...uploads.keys()];
        },

        runQueue: async () => {
          const uploads = [...get().fileUploads.values()];
          const activeUploads = uploads.filter(u => u.status === 'inProgress');

          let concurrency = get().concurrency;
          if (
            activeUploads.filter(
              activeUpload =>
                // only upload one file from folder at a time to avoid creating duplicate folders
                activeUpload.file.relativePath ||
                // only allow one s3 multipart upload at a time, it will already upload multiple parts in parallel
                activeUpload.request instanceof S3MultipartUpload ||
                // only allow one tus upload if file is larger than chunk size, tus will have parallel uploads already in that case
                (activeUpload.request instanceof TusUpload &&
                  settings.uploads.chunk_size &&
                  activeUpload.file.size > settings.uploads.chunk_size)
            ).length
          ) {
            concurrency = 1;
          }

          if (activeUploads.length < concurrency) {
            //const pendingUploads = uploads.filter(u => u.status === 'pending');
            //const next = pendingUploads.find(a => !!a.request);
            const next = uploads.find(u => u.status === 'pending');
            if (next) {
              await startUploading(next, get());
            }
          }
        },
      };
    })
  );

const updateTotals = (state: WritableDraft<FileUploadState>) => {
  state.completedUploadsCount = [...state.fileUploads.values()].filter(
    u => u.status === 'completed'
  ).length;
  state.activeUploadsCount = [...state.fileUploads.values()].filter(
    u => u.status === 'inProgress' || u.status === 'pending'
  ).length;
};
