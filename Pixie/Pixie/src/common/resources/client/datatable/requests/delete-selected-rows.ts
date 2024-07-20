import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {DatatableDataQueryKey} from './paginated-resources';
import {useDataTable} from '../page/data-table-context';
import {message} from '../../i18n/message';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';
import {Key} from 'react';

interface Response extends BackendResponse {
  //
}

export function useDeleteSelectedRows() {
  const {endpoint, selectedRows, setSelectedRows} = useDataTable();
  return useMutation(() => deleteSelectedRows(endpoint, selectedRows), {
    onSuccess: () => {
      toast(
        message('Deleted [one 1 record|other :count records]', {
          values: {count: selectedRows.length},
        })
      );
      setSelectedRows([]);
      queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
    },
    onError: err =>
      showHttpErrorToast(err, message('Could not delete records')),
  });
}

function deleteSelectedRows(endpoint: string, ids: Key[]): Promise<Response> {
  return apiClient.delete(`${endpoint}/${ids.join(',')}`).then(r => r.data);
}
