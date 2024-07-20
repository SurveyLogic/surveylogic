import {User} from '../auth/user';

export interface CustomDomain {
  id: number;
  host: string;
  user_id: number;
  user?: User;
  global: boolean;
  created_at: string;
  updated_at: string;
  resource?: Record<string, any>;
  model_type: 'customDomain';
}
