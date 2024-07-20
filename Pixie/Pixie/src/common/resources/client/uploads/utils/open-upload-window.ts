import {UploadInputConfig} from '../types/upload-input-config';
import {UploadedFile} from '../uploaded-file';
import {createUploadInput} from './create-upload-input';

/**
 * Open browser dialog for uploading files and
 * resolve promise with uploaded files.
 */
export function openUploadWindow(
  config: UploadInputConfig = {}
): Promise<UploadedFile[]> {
  return new Promise(resolve => {
    const input = createUploadInput(config);

    input.onchange = e => {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList) {
        return resolve([]);
      }

      const uploads = Array.from(fileList)
        .filter(f => f.name !== '.DS_Store')
        .map(file => new UploadedFile(file));
      resolve(uploads);
      input.remove();
    };

    document.body.appendChild(input);
    input.click();
  });
}
