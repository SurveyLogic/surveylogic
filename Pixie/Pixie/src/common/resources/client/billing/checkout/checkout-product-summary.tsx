import {Trans} from '../../i18n/trans';
import {FormattedPrice} from '../../i18n/formatted-price';
import {useCheckoutProduct} from '../requests/use-checkout-product';
import {m} from 'framer-motion';
import {Skeleton} from '../../ui/skeleton/skeleton';
import {Product} from '../product';
import {Price} from '../price';
import {FormattedCurrency} from '../../i18n/formatted-currency';
import {ProductFeatureList} from '../pricing-table/product-feature-list';
import {opacityAnimation} from '../../ui/animation/opacity-animation';

interface CheckoutProductSummaryProps {
  showBillingLine?: boolean;
}
export function CheckoutProductSummary({
  showBillingLine = true,
}: CheckoutProductSummaryProps) {
  const {status, product, price} = useCheckoutProduct();

  if (status === 'error' || (status !== 'loading' && (!product || !price))) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl mb-30">
        <Trans message="Summary" />
      </h2>
      {status === 'loading' ? (
        <LoadingSkeleton key="loading-skeleton" />
      ) : (
        <ProductSummary
          product={product!}
          price={price!}
          showBillingLine={showBillingLine}
        />
      )}
    </div>
  );
}

interface ProductSummaryProps {
  product: Product;
  price: Price;
  showBillingLine: boolean;
}
function ProductSummary({
  product,
  price,
  showBillingLine,
}: ProductSummaryProps) {
  return (
    <m.div>
      <div className="text-xl font-semibold mb-6">{product.name}</div>
      {product.description && (
        <div className="text-sm text-muted">{product.description}</div>
      )}
      <FormattedPrice
        priceClassName="font-bold text-4xl"
        periodClassName="text-muted text-xs"
        variant="separateLine"
        price={price}
        className="mt-32"
      />
      <ProductFeatureList product={product} />
      {showBillingLine && (
        <div className="flex items-center justify-between gap-24 border-t pt-24 mt-32 font-medium">
          <div>
            <Trans message="Billed today" />
          </div>
          <div>
            <FormattedCurrency value={price.amount} currency={price.currency} />
          </div>
        </div>
      )}
    </m.div>
  );
}

function LoadingSkeleton() {
  return (
    <m.div {...opacityAnimation} className="max-w-180">
      <Skeleton className="text-xl mb-6" />
      <Skeleton className="text-sm" />
      <Skeleton className="text-4xl mt-32" />
    </m.div>
  );
}
