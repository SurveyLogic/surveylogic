import {useMutation} from '@tanstack/react-query';
import {useTrans} from '@common/i18n/use-trans';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {Channel, ChannelConfig} from '@common/channels/channel';

interface Response extends BackendResponse {
  channel: Channel<NormalizedModel>;
}

interface Payload {
  channelConfig?: Partial<ChannelConfig>;
}

export function useUpdateChannelContent(channelId: number | string) {
  const {trans} = useTrans();
  return useMutation((payload: Payload) => updateChannel(channelId, payload), {
    onSuccess: () => {
      toast(trans(message('Channel content updated')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateChannel(channelId: number | string, payload: Payload) {
  return apiClient
    .post<Response>(`channel/${channelId}/update-content`, {
      ...payload,
      normalizeContent: true,
    })
    .then(r => r.data);
}
