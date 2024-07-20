import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {PaginatedBackendResponse} from '../../http/backend-response/pagination-response';
import {Product} from '../product';

const endpoint = 'billing/products';

export interface FetchProductsResponse extends BackendResponse {
  products: Product[];
}

export function useProducts() {
  return useQuery([endpoint], () => fetchProducts());
}

function fetchProducts(): Promise<FetchProductsResponse> {
  return apiClient
    .get<PaginatedBackendResponse<Product>>(endpoint)
    .then(response => {
      return {products: response.data.pagination.data};
    });
}
