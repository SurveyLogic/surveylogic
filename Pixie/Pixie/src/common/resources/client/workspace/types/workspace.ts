import {WorkspaceInvite} from './workspace-invite';
import {WorkspaceMember} from './workspace-member';

export interface Workspace {
  id: number;
  name: string;
  invites?: WorkspaceInvite[];
  members?: WorkspaceMember[];
  members_count?: number;
  owner?: WorkspaceMember;
  owner_id?: number;
  currentUser?: WorkspaceMember;
  default?: boolean;
  created_at?: string;
  updated_at?: string;
}
