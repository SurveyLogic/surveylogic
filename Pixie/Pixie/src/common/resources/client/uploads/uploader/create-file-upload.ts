import {UploadedFile} from '../uploaded-file';
import {UploadStrategyConfig} from './strategy/upload-strategy';
import {FileUpload} from './file-upload-store';

export function createUpload(
  file: UploadedFile | File,
  options?: UploadStrategyConfig
): FileUpload {
  const uploadedFile =
    file instanceof UploadedFile ? file : new UploadedFile(file);
  return {
    file: uploadedFile,
    percentage: 0,
    bytesUploaded: 0,
    status: 'pending',
    options: options || {},
  };
}
