export interface BackendMetadata {
  disk?: Disk;
  diskPrefix?: string;
  relativePath?: string | null;
  [key: string]: number | string | null | undefined;
}

export enum Disk {
  public = 'public',
  uploads = 'uploads',
}
