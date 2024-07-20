import {Permission} from './permission';

export interface Role {
  id: number;
  name: string;
  type: 'sitewide' | 'workspace';
  description: string;
  permissions?: Permission[];
  default: boolean;
  guests: boolean;
  internal: boolean;
  created_at?: string;
  updated_at?: string;
}
