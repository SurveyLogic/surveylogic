import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../../../http/query-client';
import {Invoice} from '../../invoice';
import {BackendResponse} from '../../../http/backend-response/backend-response';

const Endpoint = 'billing/invoices';

export interface FetchInvoicesResponse extends BackendResponse {
  invoices: Invoice[];
}

export function useInvoices(userId: number) {
  return useQuery([Endpoint], () => fetchInvoices(userId));
}

function fetchInvoices(userId: number): Promise<FetchInvoicesResponse> {
  return apiClient
    .get(Endpoint, {params: {userId}})
    .then(response => response.data);
}
