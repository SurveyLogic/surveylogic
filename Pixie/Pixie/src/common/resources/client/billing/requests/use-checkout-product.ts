import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {Product} from '../product';
import {useParams} from 'react-router-dom';

const endpoint = (productId: string | number) =>
  `billing/products/${productId}`;

export interface FetchProductResponse extends BackendResponse {
  product: Product;
}

export function useCheckoutProduct() {
  const {productId, priceId} = useParams();
  const query = useQuery(
    [endpoint(productId!)],
    () => fetchProduct(productId!),
    {
      keepPreviousData: true,
      enabled: productId != null && priceId != null,
    }
  );

  const product = query.data?.product;
  const price =
    product?.prices.find(p => p.id === parseInt(priceId!)) ||
    product?.prices[0];

  return {status: query.status, product, price};
}

function fetchProduct(
  productId: string | number
): Promise<FetchProductResponse> {
  return apiClient.get(endpoint(productId)).then(response => response.data);
}
