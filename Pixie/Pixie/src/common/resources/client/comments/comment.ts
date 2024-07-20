import {User} from '@common/auth/user';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  user?: User;
  depth: number;
  deleted: boolean;
  commentable_id: number;
  commentable_type: string;
  commentable?: NormalizedModel;
  children: Comment[];
  position?: number;
  created_at?: string;
}
