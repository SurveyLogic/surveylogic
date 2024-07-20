import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {AdminSettings} from '../admin-settings';
import {apiClient} from '@common/http/query-client';

export interface FetchAdminSettingsResponse
  extends BackendResponse,
    AdminSettings {}

export function useAdminSettings() {
  return useQuery(['fetchAdminSettings'], () => fetchAdminSettings(), {
    // prevent automatic re-fetching so diffing with previous settings work properly
    staleTime: Infinity,
  });
}

function fetchAdminSettings(): Promise<FetchAdminSettingsResponse> {
  return apiClient.get('settings').then(response => response.data);
}
