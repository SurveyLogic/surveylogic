export interface WorkspaceInvite {
  id: string;
  email: string;
  image: string;
  created_at: string;
  model_type: 'invite';
  role_id: number;
  role_name: string;
  display_name: string;
  avatar: string;
}
