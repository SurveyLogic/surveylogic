import {Product} from '../../../billing/product';
import {useTrans} from '../../../i18n/use-trans';
import {useNavigate} from '../../../utils/hooks/use-navigate';
import {useMutation} from '@tanstack/react-query';
import {toast} from '../../../ui/toast/toast';
import {message} from '../../../i18n/message';
import {apiClient, queryClient} from '../../../http/query-client';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {Price} from '../../../billing/price';
import {onFormQueryError} from '../../../errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';

const endpoint = 'billing/products';

export interface CreateProductPayload
  extends Omit<Partial<Product>, 'feature_list' | 'prices'> {
  feature_list: {value: string}[];
  prices: Omit<Price, 'id'>[];
}

export function useCreateProduct(form: UseFormReturn<CreateProductPayload>) {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation(
    (payload: CreateProductPayload) => createProduct(payload),
    {
      onSuccess: () => {
        toast(trans(message('Plan created')));
        queryClient.invalidateQueries([endpoint]);
        queryClient.invalidateQueries(
          DatatableDataQueryKey('billing/products')
        );
        navigate('/admin/plans');
      },
      onError: err => onFormQueryError(err, form),
    }
  );
}

function createProduct(payload: CreateProductPayload): Promise<Response> {
  const backendPayload = {
    ...payload,
    feature_list: payload.feature_list.map(feature => feature.value),
  };
  return apiClient.post(endpoint, backendPayload).then(r => r.data);
}
