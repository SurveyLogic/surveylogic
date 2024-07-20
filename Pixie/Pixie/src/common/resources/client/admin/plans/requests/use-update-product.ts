import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '../../../http/query-client';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {toast} from '../../../ui/toast/toast';
import {useTrans} from '../../../i18n/use-trans';
import {message} from '../../../i18n/message';
import {DatatableDataQueryKey} from '../../../datatable/requests/paginated-resources';
import {Product} from '../../../billing/product';
import {useNavigate} from '../../../utils/hooks/use-navigate';
import {CreateProductPayload} from './use-create-product';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '../../../errors/on-form-query-error';

interface Response extends BackendResponse {
  product: Product;
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: number;
}

const Endpoint = (id: number) => `billing/products/${id}`;

export function useUpdateProduct(form: UseFormReturn<UpdateProductPayload>) {
  const {trans} = useTrans();
  const navigate = useNavigate();
  return useMutation(
    (payload: UpdateProductPayload) => updateProduct(payload),
    {
      onSuccess: response => {
        toast(trans(message('Plan updated')));
        queryClient.invalidateQueries([Endpoint(response.product.id)]);
        queryClient.invalidateQueries(
          DatatableDataQueryKey('billing/products')
        );
        navigate('/admin/plans');
      },
      onError: err => onFormQueryError(err, form),
    }
  );
}

function updateProduct({
  id,
  ...payload
}: UpdateProductPayload): Promise<Response> {
  const backendPayload = {
    ...payload,
    feature_list: payload.feature_list.map(feature => feature.value),
  };
  return apiClient.put(Endpoint(id), backendPayload).then(r => r.data);
}
