import {UploadStrategy, UploadStrategyConfig} from './upload-strategy';
import {UploadedFile} from '../../uploaded-file';
import axios, {AxiosInstance} from 'axios';
import {FileEntry} from '../../file-entry';
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setInLocalStorage,
} from '@common/utils/hooks/local-storage';
import {apiClient} from '@common/http/query-client';
import {getAxiosErrorMessage} from '@common/utils/http/get-axios-error-message';
import axiosRetry from 'axios-retry';

const oneMB = 1024 * 1024;
// chunk size that will be uploaded to s3 per request
const desiredChunkSize = 20 * oneMB;
// how many urls should be pre-signed per call to backend
const batchSize = 10;
// number of concurrent requests to s3 api
const concurrency = 5;

interface ChunkState {
  blob: Blob | File;
  done: boolean;
  etag?: string;
  partNumber: number;
  bytesUploaded: number;
}

interface SignedUrl {
  url: string;
  partNumber: number;
}

interface StoredUrl {
  createdAt: string;
  uploadId: string;
  fileKey: string;
}

interface UploadedPart {
  PartNumber: number;
  ETag: string;
  Size: string;
  LastModified: string;
}

export class S3MultipartUpload implements UploadStrategy {
  private abortController: AbortController;
  private chunks: ChunkState[] = [];
  private uploadId?: string;
  private fileKey?: string;
  private readonly chunkAxios: AxiosInstance;
  private abortedByUser = false;
  private uploadedParts?: UploadedPart[];

  get storageKey(): string {
    return `s3-multipart::${this.file.fingerprint}`;
  }

  constructor(
    private file: UploadedFile,
    private config: UploadStrategyConfig
  ) {
    this.abortController = new AbortController();
    this.chunkAxios = axios.create();
    axiosRetry(this.chunkAxios, {retries: 3});
  }

  async start() {
    const storedUrl = getFromLocalStorage(this.storageKey);
    if (storedUrl) {
      await this.getUploadedParts(storedUrl);
    }

    if (!this.uploadedParts?.length) {
      await this.createMultipartUpload();
      if (!this.uploadId) return;
    }

    this.prepareChunks();

    const result = await this.uploadParts();
    if (result === 'done') {
      const isCompleted = await this.completeMultipartUpload();
      if (!isCompleted) return;

      // catch any errors so below "onError" handler gets executed
      try {
        const response = await this.createFileEntry();
        if (response?.fileEntry) {
          this.config.onSuccess?.(response?.fileEntry, this.file);
          removeFromLocalStorage(this.storageKey);
          return;
        }
      } catch {}
    }

    // upload failed
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
    if (!this.abortedByUser) {
      this.config.onError?.(null, this.file);
    }
  }

  async abort() {
    this.abortedByUser = true;
    this.abortController.abort();
    await this.abortUploadOnS3();
  }

  private async uploadParts(): Promise<any> {
    const pendingChunks = this.chunks.filter(c => !c.done);
    if (!pendingChunks.length) {
      return Promise.resolve('done');
    }

    const signedUrls = await this.batchSignUrls(
      pendingChunks.slice(0, batchSize)
    );
    if (!signedUrls) return;

    while (signedUrls.length) {
      const batch = signedUrls.splice(0, concurrency);
      const pendingUploads = batch.map(item => {
        return this.uploadPartToS3(item);
      });
      const result = await Promise.all(pendingUploads);
      // if not all uploads in batch completed, bail
      if (!result.every(r => r)) return;
    }

    return await this.uploadParts();
  }

  private async batchSignUrls(
    batch: ChunkState[]
  ): Promise<SignedUrl[] | undefined> {
    const response = await this.chunkAxios
      .post(
        'api/v1/s3/multipart/batch-sign-part-urls',
        {
          partNumbers: batch.map(i => i.partNumber),
          uploadId: this.uploadId,
          key: this.fileKey,
        },
        {signal: this.abortController.signal}
      )
      .then(r => r.data as {urls: SignedUrl[]})
      .catch(err => {
        if (!this.abortController.signal.aborted) {
          this.abortController.abort();
        }
      });

    return response?.urls;
  }

  private async uploadPartToS3({
    url,
    partNumber,
  }: SignedUrl): Promise<boolean | void> {
    const chunk = this.chunks.find(c => c.partNumber === partNumber);
    if (!chunk) return;
    return this.chunkAxios
      .put(url, chunk.blob, {
        withCredentials: false,
        signal: this.abortController.signal,
        onUploadProgress: (e: ProgressEvent) => {
          if (!e.lengthComputable) return;

          chunk.bytesUploaded = e.loaded;
          const totalUploaded = this.chunks.reduce(
            (n, c) => n + c.bytesUploaded,
            0
          );

          this.config.onProgress?.({
            bytesUploaded: totalUploaded,
            bytesTotal: this.file.size,
          });
        },
      })
      .then(r => {
        const etag = r.headers.etag;
        if (etag) {
          chunk.done = true;
          chunk.etag = etag;
          return true;
        }
      })
      .catch(err => {
        if (!this.abortController.signal.aborted && err !== undefined) {
          this.abortController.abort();
        }
      });
  }

  private async createMultipartUpload(): Promise<void> {
    const response = await apiClient
      .post('s3/multipart/create', {
        filename: this.file.name,
        mime: this.file.mime,
        size: this.file.size,
        extension: this.file.extension,
        ...this.config.metadata,
      })
      .then(r => r.data as {uploadId: string; key: string})
      .catch(err => {
        if (err.code !== 'ERR_CANCELED') {
          this.config.onError?.(getAxiosErrorMessage(err), this.file);
        }
      });

    if (response) {
      this.uploadId = response.uploadId;
      this.fileKey = response.key;
      setInLocalStorage(this.storageKey, {
        createdAt: new Date().toISOString(),
        fileKey: this.fileKey,
        uploadId: this.uploadId,
      } as StoredUrl);
    }
  }

  private async getUploadedParts({fileKey, uploadId}: StoredUrl) {
    const response = await apiClient
      .post('s3/multipart/get-uploaded-parts', {
        key: fileKey,
        uploadId,
      })
      .then(r => r.data as {parts: UploadedPart[]})
      .catch(() => {
        removeFromLocalStorage(this.storageKey);
        return null;
      });
    if (response?.parts?.length) {
      this.uploadedParts = response.parts;
      this.uploadId = uploadId;
      this.fileKey = fileKey;
    }
  }

  private async completeMultipartUpload(): Promise<{location: string} | null> {
    return apiClient
      .post('s3/multipart/complete', {
        key: this.fileKey,
        uploadId: this.uploadId,
        parts: this.chunks.map(c => {
          return {
            ETag: c.etag,
            PartNumber: c.partNumber,
          };
        }),
      })
      .then(r => r.data)
      .catch(() => {
        this.config.onError?.(null, this.file);
        this.abortUploadOnS3();
      })
      .finally(() => {
        removeFromLocalStorage(this.storageKey);
      });
  }

  private async createFileEntry(): Promise<{fileEntry: FileEntry}> {
    return await apiClient
      .post('s3/entries', {
        ...this.config.metadata,
        clientMime: this.file.mime,
        clientName: this.file.name,
        filename: this.fileKey!.split('/').pop(),
        size: this.file.size,
        clientExtension: this.file.extension,
      })
      .then(r => r.data)
      .catch();
  }

  private prepareChunks() {
    this.chunks = [];
    // at least 5MB per request, at most 10k requests
    const minChunkSize = Math.max(5 * oneMB, Math.ceil(this.file.size / 10000));
    const chunkSize = Math.max(desiredChunkSize, minChunkSize);

    // Upload zero-sized files in one zero-sized chunk
    if (this.file.size === 0) {
      this.chunks.push({
        blob: this.file.native,
        done: false,
        partNumber: 1,
        bytesUploaded: 0,
      });
    } else {
      let partNumber = 1;
      for (let i = 0; i < this.file.size; i += chunkSize) {
        const end = Math.min(this.file.size, i + chunkSize);
        // check if this part was already uploaded previously
        const previouslyUploaded = this.uploadedParts?.find(
          p => p.PartNumber === partNumber
        );
        this.chunks.push({
          blob: this.file.native.slice(i, end),
          done: !!previouslyUploaded,
          partNumber,
          etag: previouslyUploaded ? previouslyUploaded.ETag : undefined,
          bytesUploaded: previouslyUploaded?.Size
            ? parseInt(previouslyUploaded?.Size)
            : 0,
        });
        partNumber++;
      }
    }
  }

  private abortUploadOnS3() {
    return apiClient.post('s3/multipart/abort', {
      key: this.fileKey,
      uploadId: this.uploadId,
    });
  }

  static async create(
    file: UploadedFile,
    config: UploadStrategyConfig
  ): Promise<S3MultipartUpload> {
    return new S3MultipartUpload(file, config);
  }
}
