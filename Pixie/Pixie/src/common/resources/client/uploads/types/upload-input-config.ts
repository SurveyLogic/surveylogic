export interface UploadInputConfig {
  types?: (UploadInputType | string)[];
  extensions?: string[];
  multiple?: boolean;
  directory?: boolean;
}

export enum UploadInputType {
  image = 'image/*',
  audio = 'audio/*',
  json = 'application/json',
  video = 'video/mp4,video/mpeg,video/x-m4v,video/*',
}
