import {QueryClient} from '@tanstack/react-query';
import axios, {AxiosRequestConfig} from 'axios';
import {getActiveWorkspaceId} from '../workspace/active-workspace-id';
import {isAbsoluteUrl} from '../utils/urls/is-absolute-url';
import {errorStatusIs} from '@common/utils/http/error-status-is';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: (failureCount, err) => {
        return (
          !errorStatusIs(err, 401) &&
          !errorStatusIs(err, 403) &&
          !errorStatusIs(err, 404) &&
          failureCount < 2
        );
      },
    },
  },
});

export const apiClient = axios.create();
apiClient.defaults.withCredentials = true;
apiClient.defaults.responseType = 'json';
// @ts-ignore
apiClient.defaults.headers = {
  common: {
    Accept: 'application/json',
  },
};

apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  if (
    !config.url?.startsWith('auth') &&
    !config.url?.startsWith('secure') &&
    !isAbsoluteUrl(config?.url)
  ) {
    config.url = `api/v1/${config.url}`;
  }

  const method = config.method?.toUpperCase();

  // transform array query params in GET request to comma separated string
  if (method === 'GET' && Array.isArray(config.params?.with)) {
    config.params.with = config.params.with.join(',');
  }

  // add workspace query parameter
  const workspaceId = getActiveWorkspaceId();
  if (workspaceId) {
    const method = config.method?.toLowerCase();
    if (['get', 'post', 'put'].includes(method!)) {
      config.params = {...config.params, workspaceId};
    }
  }

  // override PUT, DELETE, PATCH methods, they might not be supported on the backend
  if (method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
    config.headers = {
      ...config.headers,
      'X-HTTP-Method-Override': method,
    };
    config.method = 'POST';
    config.params = {
      ...config.params,
      _method: method,
    };
  }

  return config;
});
