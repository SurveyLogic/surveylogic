import {Upload} from 'tus-js-client';
import {UploadedFile} from '../../uploaded-file';
import {UploadStrategy, UploadStrategyConfig} from './upload-strategy';
import {FileEntry} from '../../file-entry';
import {getAxiosErrorMessage} from '@common/utils/http/get-axios-error-message';
import {apiClient} from '@common/http/query-client';
import {getCookie} from 'react-use-cookie';

export class TusUpload implements UploadStrategy {
  constructor(private upload: Upload) {}

  start() {
    this.upload.start();
  }

  abort() {
    return this.upload.abort(true);
  }

  static async create(
    file: UploadedFile,
    {
      onProgress,
      onSuccess,
      onError,
      metadata,
      chunkSize,
      baseUrl,
    }: UploadStrategyConfig
  ): Promise<TusUpload> {
    const tusFingerprint = ['tus', file.fingerprint, 'drive'].join('-');
    const upload = new Upload(file.native, {
      fingerprint: () => Promise.resolve(tusFingerprint),
      removeFingerprintOnSuccess: true,
      endpoint: `${baseUrl}/api/v1/tus/upload`,
      chunkSize,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      overridePatchMethod: true,
      metadata: {
        name: window.btoa(file.id),
        clientName: file.name,
        clientExtension: file.extension,
        clientMime: file.mime || '',
        clientSize: `${file.size}`,
        ...(metadata as Record<string, string>),
      },
      headers: {
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      },
      onError: err => {
        if ('originalResponse' in err) {
          try {
            const message = JSON.parse(err.originalResponse.getBody())?.message;
            onError?.(message, file);
          } catch (e) {
            onError?.(null, file);
          }
        } else {
          onError?.(null, file);
        }
      },
      onProgress(bytesUploaded, bytesTotal) {
        onProgress?.({bytesUploaded, bytesTotal});
      },
      onSuccess: async () => {
        const uploadKey = upload.url?.split('/').pop();
        try {
          if (uploadKey) {
            const response = await createFileEntry(uploadKey);
            onSuccess?.(response.fileEntry, file);
          }
        } catch (err) {
          localStorage.removeItem(tusFingerprint);
          onError?.(getAxiosErrorMessage(err), file);
        }
      },
    });

    const previousUploads = await upload.findPreviousUploads();
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    return new TusUpload(upload);
  }
}

function createFileEntry(uploadKey: string): Promise<{fileEntry: FileEntry}> {
  return apiClient.post('tus/entries', {uploadKey}).then(r => r.data);
}
