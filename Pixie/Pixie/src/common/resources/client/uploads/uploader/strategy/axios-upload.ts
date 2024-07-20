import {UploadedFile} from '../../uploaded-file';
import {UploadStrategy, UploadStrategyConfig} from './upload-strategy';
import {apiClient} from '@common/http/query-client';
import {getAxiosErrorMessage} from '@common/utils/http/get-axios-error-message';

export class AxiosUpload implements UploadStrategy {
  private abortController: AbortController;
  constructor(
    private file: UploadedFile,
    private config: UploadStrategyConfig
  ) {
    this.abortController = new AbortController();
  }

  async start() {
    const formData = new FormData();
    const {onSuccess, onError, onProgress, metadata} = this.config;

    formData.set('file', this.file.native);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.set(key, `${value}`);
      });
    }

    const response = await apiClient
      .post('file-entries', formData, {
        onUploadProgress: (e: ProgressEvent) => {
          if (e.lengthComputable) {
            onProgress?.({
              bytesUploaded: e.loaded,
              bytesTotal: e.total,
            });
          }
        },
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch(err => {
        if (err.code !== 'ERR_CANCELED') {
          onError?.(getAxiosErrorMessage(err), this.file);
        }
      });

    // if upload was aborted, it will be handled and set
    // as "aborted" already, no need to set it as "failed"
    if (this.abortController.signal.aborted) {
      return;
    }

    if (response && response.data.fileEntry) {
      onSuccess?.(response.data.fileEntry, this.file);
    }
  }

  abort() {
    this.abortController.abort();
    return Promise.resolve();
  }

  static async create(
    file: UploadedFile,
    config: UploadStrategyConfig
  ): Promise<AxiosUpload> {
    return new AxiosUpload(file, config);
  }
}
