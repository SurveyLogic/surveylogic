import {getFileMime} from './utils/get-file-mime';
import {extensionFromFilename} from './utils/extension-from-filename';
import {nanoid} from 'nanoid';
import {getActiveWorkspaceId} from '../workspace/active-workspace-id';

export class UploadedFile {
  id: string;
  fingerprint: string;
  name: string;
  relativePath = '';
  size: number;
  mime = '';
  extension = '';
  native: File;
  lastModified: number;

  private cachedData?: string;
  get data(): Promise<string> {
    return new Promise(resolve => {
      if (this.cachedData) {
        resolve(this.cachedData);
      }
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.cachedData = reader.result as string;
        resolve(this.cachedData);
      });

      if (this.extension === 'json') {
        reader.readAsText(this.native);
      } else {
        reader.readAsDataURL(this.native);
      }
    });
  }

  constructor(file: File, relativePath?: string | null) {
    this.id = nanoid();
    this.name = file.name;
    this.size = file.size;
    this.mime = getFileMime(file);
    this.lastModified = file.lastModified;
    this.extension = extensionFromFilename(file.name) || 'bin';
    this.native = file;
    relativePath = relativePath || file.webkitRelativePath || '';

    // remove leading slashes
    relativePath = relativePath.replace(/^\/+/g, '');

    // only include relative path if file is actually in a folder and not just /file.txt
    if (relativePath && relativePath.split('/').length > 1) {
      this.relativePath = relativePath;
    }

    this.fingerprint = generateId({
      name: this.name,
      size: this.size,
      mime: this.mime,
      lastModified: this.lastModified,
    });
  }
}

interface FileMeta {
  name?: string;
  mime?: string | null;
  size?: number | string;
  lastModified?: number;
  relativePath?: string;
}
function generateId({name, mime, size, relativePath, lastModified}: FileMeta) {
  let id = 'be';
  if (typeof name === 'string') {
    id += `-${encodeFilename(name.toLowerCase())}`;
  }

  if (mime) {
    id += `-${mime}`;
  }

  if (typeof relativePath === 'string') {
    id += `-${encodeFilename(relativePath.toLowerCase())}`;
  }

  if (size !== undefined) {
    id += `-${size}`;
  }
  if (lastModified !== undefined) {
    id += `-${lastModified}`;
  }

  id += `${getActiveWorkspaceId()}`;

  // add version number, so it can be incremented easily to allow uploading same file multiple times
  return `${id}-v1`;
}

function encodeCharacter(character: string) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name: string) {
  let suffix = '';
  return (
    name.replace(/[^A-Z0-9]/gi, character => {
      suffix += `-${encodeCharacter(character)}`;
      return '/';
    }) + suffix
  );
}
