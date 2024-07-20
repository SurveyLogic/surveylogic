import {useQuery} from '@tanstack/react-query';
import {WorkspaceQueryKeys} from './workspace-query-keys';
import {Workspace} from '../types/workspace';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient} from '../../http/query-client';

export interface FetchWorkspaceWithMembersResponse extends BackendResponse {
  workspace: Workspace;
}

function fetchWorkspaceWithMembers(
  workspaceId: number
): Promise<FetchWorkspaceWithMembersResponse> {
  return apiClient
    .get(`workspace/${workspaceId}`)
    .then(response => response.data);
}

export function useWorkspaceWithMembers(workspaceId: number) {
  return useQuery(WorkspaceQueryKeys.workspaceWithMembers(workspaceId), () =>
    fetchWorkspaceWithMembers(workspaceId)
  );
}
