import {apiClient, queryClient} from '../../http/query-client';
import {BootstrapData} from './bootstrap-data';
import {useQuery} from '@tanstack/react-query';

const queryKey = ['bootstrapData'];

export function getBootstrapData(): BootstrapData {
  return queryClient.getQueryData(queryKey)!;
}

export function invalidateBootstrapData() {
  queryClient.invalidateQueries(queryKey);
}

export function setBootstrapData(data: string | BootstrapData) {
  queryClient.setQueryData<BootstrapData>(
    queryKey,
    typeof data === 'string' ? decodeBootstrapData(data) : data
  );
}

export function mergeBootstrapData(partialData: Partial<BootstrapData>) {
  setBootstrapData({
    ...getBootstrapData(),
    ...partialData,
  });
}

// set bootstrap data that was provided with initial request from backend
const initialBootstrapData = (
  typeof window !== 'undefined' && window.bootstrapData
    ? JSON.parse(atob(window.bootstrapData))
    : {}
) as BootstrapData;
// make sure initial data is available right away when accessing it via "getBootstrapData()"
queryClient.setQueryData(queryKey, initialBootstrapData);

export function useBackendBootstrapData() {
  const {data} = useQuery(queryKey, fetchBootstrapData, {
    staleTime: Infinity,
    keepPreviousData: true,
    initialData: initialBootstrapData,
  });
  return data;
}

const fetchBootstrapData = async (): Promise<BootstrapData> => {
  return apiClient.get('bootstrap-data').then(response => {
    return decodeBootstrapData(response.data.data);
  });
};

function decodeBootstrapData(data: string | BootstrapData): BootstrapData {
  return typeof data === 'string' ? JSON.parse(atob(data)) : data;
}
