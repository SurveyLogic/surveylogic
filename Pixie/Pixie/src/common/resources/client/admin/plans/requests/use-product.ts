import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../../http/backend-response/backend-response';
import {apiClient} from '../../../http/query-client';
import {useParams} from 'react-router-dom';
import {Product} from '../../../billing/product';

const Endpoint = (id: number | string) => `billing/products/${id}`;

export interface FetchRoleResponse extends BackendResponse {
  product: Product;
}

export function useProduct() {
  const {productId} = useParams();
  return useQuery([Endpoint(productId!)], () => fetchProduct(productId!));
}

function fetchProduct(productId: number | string): Promise<FetchRoleResponse> {
  return apiClient.get(Endpoint(productId)).then(response => response.data);
}
