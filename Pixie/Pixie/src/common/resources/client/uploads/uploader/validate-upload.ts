import {UploadedFile} from '../uploaded-file';
import {message} from '../../i18n/message';
import {prettyBytes} from '../utils/pretty-bytes';
import {MessageDescriptor} from '../../i18n/message-descriptor';
import match from 'mime-match';

export interface Restrictions {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  blockedFileTypes?: string[];
}

export function validateUpload(
  file: UploadedFile,
  restrictions?: Restrictions
): MessageDescriptor | void {
  if (!restrictions) return;

  const {maxFileSize, allowedFileTypes, blockedFileTypes} = restrictions;

  if (maxFileSize && file.size != null && file.size > maxFileSize) {
    return message('`:file` exceeds maximum allowed size of :size', {
      values: {file: file.name, size: prettyBytes(maxFileSize)},
    });
  }

  if (allowedFileTypes?.length) {
    if (!fileMatchesTypes(file, allowedFileTypes)) {
      return message('This file type is not allowed');
    }
  }

  if (blockedFileTypes?.length) {
    if (fileMatchesTypes(file, blockedFileTypes)) {
      return message('This file type is not allowed');
    }
  }
}

function fileMatchesTypes(file: UploadedFile, types: string[]): boolean {
  return (
    types
      // support multiple file types in a string (video/mp4,audio/mp3,image/png)
      .map(type => type.split(','))
      .flat()
      .some(type => {
        // check if this is a mime-type
        if (type.includes('/')) {
          if (!file.mime) return false;
          return match(file.mime.replace(/;.*?$/, ''), type);
        }

        // otherwise this is likely an extension
        if (type.replace('.', '') && file.extension) {
          return file.extension.toLowerCase() === type.toLowerCase();
        }
        return false;
      })
  );
}
