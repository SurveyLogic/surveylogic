import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useParams} from 'react-router-dom';
import {Channel} from '@common/channels/channel';

interface Response extends BackendResponse {
  channel: Channel;
}

type UserParams = Record<string, string | boolean>;

export function channelQueryKey(slugOrId: number | string, params: UserParams) {
  return ['channel', `${slugOrId}`, params];
}

export function channelEndpoint(slugOrId: number | string) {
  return `channel/${slugOrId}`;
}

export function useChannel(
  slugOrId?: string | number,
  userParams?: UserParams
) {
  const params = useParams();
  slugOrId = slugOrId || params.slugOrId;
  const queryParams = {
    ...userParams,
    filter: params.filter || '',
    paginate: 'simple',
  };
  return useQuery(channelQueryKey(slugOrId!, queryParams), () =>
    fetchChannel(slugOrId!, queryParams)
  );
}

function fetchChannel(
  slugOrId: number | string,
  params: Record<string, string | number | undefined> = {}
): Promise<Response> {
  return apiClient
    .get(channelEndpoint(slugOrId), {params})
    .then(response => response.data);
}
