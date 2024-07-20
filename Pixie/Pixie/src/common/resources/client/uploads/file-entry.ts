import {Tag} from '../tags/tag';

export interface FileEntry {
  id: number;
  name: string;
  mime: string;
  url: string;
  hash: string;
  extension?: string;
  type: 'folder' | string;
  public?: boolean;
  description?: string;
  path: string;
  tags?: Tag[];
  file_name: string;
  file_size?: number;
  parent_id: number | null;
  thumbnail?: boolean;
  parent?: FileEntry;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  children?: FileEntry[];
  users?: {id: number; email: string}[];
}
