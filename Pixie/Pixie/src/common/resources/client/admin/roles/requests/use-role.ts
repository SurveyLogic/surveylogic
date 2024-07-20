import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {apiClient} from '../../../http/query-client';
import {Role} from '../../../auth/role';
import {useParams} from 'react-router-dom';

const Endpoint = (id: number | string) => `roles/${id}`;

export interface FetchRoleResponse extends BackendResponse {
  role: Role;
}

function fetchRole(roleId: number | string): Promise<FetchRoleResponse> {
  return apiClient.get(Endpoint(roleId)).then(response => response.data);
}

export function useRole() {
  const {roleId} = useParams();
  return useQuery([Endpoint(roleId!)], () => fetchRole(roleId!));
}
