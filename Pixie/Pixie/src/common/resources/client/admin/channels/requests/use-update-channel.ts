import {useMutation} from '@tanstack/react-query';
import {useTrans} from '@common/i18n/use-trans';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Channel} from '@common/channels/channel';
import {CreateChannelPayload} from '@common/admin/channels/requests/use-create-channel';

interface Response extends BackendResponse {
  channel: Channel;
}

export interface UpdateChannelPayload extends CreateChannelPayload {
  id: number;
}

const Endpoint = (id: number) => `channel/${id}`;

export function useUpdateChannel(form: UseFormReturn<UpdateChannelPayload>) {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation(
    (payload: UpdateChannelPayload) => updateChannel(payload),
    {
      onSuccess: () => {
        toast(trans(message('Channel updated')));
        queryClient.invalidateQueries(DatatableDataQueryKey('channel'));
        navigate('/admin/channels');
      },
      onError: err => onFormQueryError(err, form),
    }
  );
}

function updateChannel({
  id,
  ...payload
}: UpdateChannelPayload): Promise<Response> {
  return apiClient.put(Endpoint(id), payload).then(r => r.data);
}
