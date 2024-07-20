import {UploadStrategy, UploadStrategyConfig} from './strategy/upload-strategy';
import {UploadedFile} from '../uploaded-file';
import {Disk} from '../types/backend-metadata';
import {S3MultipartUpload} from './strategy/s3-multipart-upload';
import {S3Upload} from './strategy/s3-upload';
import {TusUpload} from './strategy/tus-upload';
import {AxiosUpload} from './strategy/axios-upload';
import {FileUpload, FileUploadState} from './file-upload-store';
import {validateUpload} from './validate-upload';
import {getBootstrapData} from '../../core/bootstrap-data/use-backend-bootstrap-data';
import {toast} from '../../ui/toast/toast';
import {ProgressTimeout} from './progress-timeout';
import {message} from '../../i18n/message';

export async function startUploading(
  upload: FileUpload,
  state: FileUploadState
): Promise<UploadStrategy | null> {
  const settings = getBootstrapData().settings;
  const options = upload.options;
  const file = upload.file;

  // validate file, if validation fails, error the upload and bail
  if (options?.restrictions) {
    const errorMessage = validateUpload(file, options.restrictions);
    if (errorMessage) {
      state.updateFileUpload(file.id, {
        errorMessage,
        status: 'failed',
        request: undefined,
        timer: undefined,
      });

      if (options.showToastOnRestrictionFail) {
        toast.danger(errorMessage);
      }

      state.runQueue();
      return null;
    }
  }

  // prepare config for file upload strategy
  const timer = new ProgressTimeout();
  const config: UploadStrategyConfig = {
    metadata: {
      ...options?.metadata,
      relativePath: file.relativePath,
      disk: options?.metadata?.disk || Disk.uploads,
      parentId: options?.metadata?.parentId || '',
    },
    chunkSize: settings.uploads.chunk_size,
    baseUrl: settings.base_url,
    onError: errorMessage => {
      state.updateFileUpload(file.id, {
        errorMessage,
        status: 'failed',
      });
      state.runQueue();
      timer.done();
      options?.onError?.(errorMessage, file);
    },
    onSuccess: entry => {
      state.updateFileUpload(file.id, {
        status: 'completed',
        entry,
      });
      state.runQueue();
      timer.done();
      options?.onSuccess?.(entry, file);
    },
    onProgress: ({bytesUploaded, bytesTotal}) => {
      const percentage = (bytesUploaded / bytesTotal) * 100;
      state.updateFileUpload(file.id, {
        percentage,
        bytesUploaded,
      });
      timer.progress();
      options?.onProgress?.({bytesUploaded, bytesTotal});
    },
  };

  // choose and create upload strategy, based on file size and settings
  const strategy = chooseUploadStrategy(file, config);
  const request = await strategy.create(file, config);

  // add handler for when upload times out (no progress for 30+ seconds)
  timer.timeoutHandler = () => {
    request.abort();
    state.updateFileUpload(file.id, {
      status: 'failed',
      errorMessage: message('Upload timed out'),
    });
    state.runQueue();
  };

  state.updateFileUpload(file.id, {
    status: 'inProgress',
    request,
  });
  request.start();

  return request;
}

const OneMB = 1024 * 1024;
const FourMB = 4 * OneMB;
const HundredMB = 100 * OneMB;

const chooseUploadStrategy = (
  file: UploadedFile,
  config: UploadStrategyConfig
) => {
  const settings = getBootstrapData().settings;
  const disk = config.metadata?.disk || Disk.uploads;
  const driver =
    disk === Disk.uploads
      ? settings.uploads.uploads_driver
      : settings.uploads.public_driver;

  if (driver?.endsWith('s3') && settings.uploads.s3_direct_upload) {
    return file.size >= HundredMB ? S3MultipartUpload : S3Upload;
  } else {
    // 4MB = Axios, otherwise Tus
    return file.size >= FourMB && !settings.uploads.disable_tus
      ? TusUpload
      : AxiosUpload;
  }
};
