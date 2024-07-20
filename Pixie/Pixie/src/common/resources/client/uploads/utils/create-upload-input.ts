import {UploadInputConfig} from '../types/upload-input-config';

export function createUploadInput(
  config: UploadInputConfig = {}
): HTMLInputElement {
  const old = document.querySelector('#hidden-file-upload-input');
  if (old) old.remove();

  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = config.multiple ?? false;
  input.classList.add('hidden');
  input.style.display = 'none';
  input.style.visibility = 'hidden';
  input.id = 'hidden-file-upload-input';

  input.accept = buildUploadInputAccept(config);

  if (config.directory) {
    input.webkitdirectory = true;
  }

  document.body.appendChild(input);

  return input;
}

export interface UploadAccentProps {
  extensions?: string[];
  types?: string[];
}
export function buildUploadInputAccept({
  extensions = [],
  types = [],
}: UploadAccentProps): string {
  const accept = [];
  if (extensions?.length) {
    extensions = extensions.map(e => {
      return e.startsWith('.') ? e : `.${e}`;
    });
    accept.push(extensions.join(','));
  }

  if (types?.length) {
    accept.push(types.join(','));
  }

  return accept.join(',');
}
