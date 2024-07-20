import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';

export interface ActiveSession {
  id: string;
  platform?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  country?: string;
  city?: string;
  ip_address?: string;
  token?: string;
  is_current_device: boolean;
  last_active: string;
}

interface Response extends BackendResponse {
  sessions: ActiveSession[];
}

export function useUserSessions() {
  return useQuery(['user-sessions'], () => fetchUserSessions());
}

function fetchUserSessions() {
  return apiClient
    .get<Response>(`user-sessions`)
    .then(response => response.data);
}
