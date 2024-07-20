import {useQuery} from '@tanstack/react-query';
import {WorkspaceQueryKeys} from './requests/workspace-query-keys';
import {Workspace} from './types/workspace';
import {BackendResponse} from '../http/backend-response/backend-response';
import {apiClient} from '../http/query-client';

export interface FetchUserWorkspacesResponse extends BackendResponse {
  workspaces: Workspace[];
}

export const PersonalWorkspace: Workspace = {
  name: 'Default',
  default: true,
  id: 0,
  members_count: 1,
};

function fetchUserWorkspaces(): Promise<FetchUserWorkspacesResponse> {
  return apiClient.get(`me/workspaces`).then(response => response.data);
}

function addPersonalWorkspaceToResponse(response: FetchUserWorkspacesResponse) {
  return [PersonalWorkspace, ...response.workspaces];
}

export function useUserWorkspaces() {
  return useQuery(WorkspaceQueryKeys.fetchUserWorkspaces, fetchUserWorkspaces, {
    placeholderData: {workspaces: []},
    select: addPersonalWorkspaceToResponse,
  });
}
