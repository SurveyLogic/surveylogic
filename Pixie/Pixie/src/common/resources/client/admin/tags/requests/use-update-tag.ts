import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@common/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {Tag} from '@common/tags/tag';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';

interface Response extends BackendResponse {
  tag: Tag;
}

export interface UpdateTagPayload extends Partial<Tag> {
  id: number;
}

export function useUpdateTag(form: UseFormReturn<UpdateTagPayload>) {
  const {trans} = useTrans();
  return useMutation((props: UpdateTagPayload) => updateTag(props), {
    onSuccess: () => {
      toast(trans(message('Tag updated')));
      queryClient.invalidateQueries(DatatableDataQueryKey('tags'));
    },
    onError: err => onFormQueryError(err, form),
  });
}

function updateTag({id, ...payload}: UpdateTagPayload): Promise<Response> {
  return apiClient.put(`tags/${id}`, payload).then(r => r.data);
}
