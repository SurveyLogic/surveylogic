import {BackendMetadata} from '../../types/backend-metadata';
import {Restrictions} from '../validate-upload';
import {FileEntry} from '../../file-entry';
import {UploadedFile} from '@common/uploads/uploaded-file';

export interface UploadStrategyConfig {
  chunkSize?: number;
  baseUrl?: string;
  restrictions?: Restrictions;
  showToastOnRestrictionFail?: boolean;
  onProgress?: (progress: {bytesUploaded: number; bytesTotal: number}) => void;
  onSuccess?: (entry: FileEntry, file: UploadedFile) => void;
  onError?: (message: string | undefined | null, file: UploadedFile) => void;
  metadata?: BackendMetadata;
}

export interface UploadStrategy {
  start: () => void;
  abort: () => Promise<void>;
}
