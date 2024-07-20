import {extensionFromFilename} from './extension-from-filename';

export function getFileMime(file: File): string {
  const extensionsToMime: Record<string, string> = {
    md: 'text/markdown',
    markdown: 'text/markdown',
    mp4: 'video/mp4',
    mp3: 'audio/mp3',
    svg: 'image/svg+xml',
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    yaml: 'text/yaml',
    yml: 'text/yaml',
  };

  const fileExtension = file.name ? extensionFromFilename(file.name) : null;

  // check if mime type is set in the file object
  if (file.type) {
    return file.type;
  }

  // see if we can map extension to a mime type
  if (fileExtension && fileExtension in extensionsToMime) {
    return extensionsToMime[fileExtension];
  }

  return 'application/octet-stream';
}
