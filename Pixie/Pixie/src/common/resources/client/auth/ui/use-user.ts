import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {User} from '../user';
import {apiClient} from '../../http/query-client';

export interface FetchUseUserResponse extends BackendResponse {
  user: User;
}

interface Params {
  with: string[];
}

type UserId = number | string | 'me';
const queryKey = (id: UserId, params?: Params) => {
  const key: any[] = ['users', `${id}`];
  if (params) {
    key.push(params);
  }
  return key;
};

export function useUser(id: UserId, params?: Params) {
  return useQuery(queryKey(id, params), () => fetchUser(id, params));
}

function fetchUser(id: UserId, params?: Params): Promise<FetchUseUserResponse> {
  return apiClient.get(`users/${id}`, {params}).then(response => response.data);
}
