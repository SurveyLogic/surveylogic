import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {apiClient, queryClient} from '@common/http/query-client';
import {toast} from '@common/ui/toast/toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {useTrans} from '@common/i18n/use-trans';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {message} from '@common/i18n/message';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {PaginationResponse} from '@common/http/backend-response/pagination-response';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Channel} from '@common/channels/channel';

const endpoint = 'channel';

interface Response extends BackendResponse {
  channel: Channel;
}

export interface CreateChannelPayload extends Omit<Channel, 'content'> {
  content: PaginationResponse<NormalizedModel>;
}

export function useCreateChannel(form: UseFormReturn<CreateChannelPayload>) {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation(
    (payload: CreateChannelPayload) => createChannel(payload),
    {
      onSuccess: response => {
        toast(trans(message('Channel created')));
        queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
        navigate(`/admin/channels/${response.channel.id}/edit`, {
          replace: true,
        });
      },
      onError: err => onFormQueryError(err, form),
    }
  );
}

function createChannel(payload: CreateChannelPayload) {
  return apiClient.post<Response>(endpoint, payload).then(r => r.data);
}
